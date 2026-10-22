import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class FinancialTransactionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(body: any) {
    const client = this.prisma.tenantClient as any;

    return client.financialTransaction.create({
      data: {
        patientId: body.patientId ? BigInt(body.patientId) : null,
        description: body.description,
        amount: body.amount, // Ex: 150.00
        type: body.type,     // "INCOME" (Receita) ou "EXPENSE" (Despesa)
        status: body.status || 'pending', // "paid", "pending", "overdue"
        dueDate: new Date(body.dueDate),
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        paymentMethod: body.paymentMethod,
      },
    });
  }

  // 2. Retorna o extrato de movimentações completo da clínica atual
  async findAll() {
    const client = this.prisma.tenantClient as any;

    return client.financialTransaction.findMany({
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async getBalance() {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

   
    const incomeAggregation = await model.aggregate({
      _sum: { amount: true },
      where: {
        type: 'INCOME',
        status: 'paid',
      },
    });

    const expenseAggregation = await model.aggregate({
      _sum: { amount: true },
      where: {
        type: 'EXPENSE',
        status: 'paid', 
      },
    });

    const totalIncome = Number(incomeAggregation._sum.amount || 0);
    const totalExpense = Number(expenseAggregation._sum.amount || 0);
    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
    };
  }

  async payout(id: string, body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

    const transaction = await model.findFirst({
      where: { id: BigInt(id) },
    });

    if (!transaction) {
      throw new Error('Financial transaction not found for this clinic.');
    }

    return model.update({
      where: { id: transaction.id },
      data: {
        status: 'paid', // Transforma o status para PAGO!
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(), 
        paymentMethod: body.paymentMethod, // ex: "pix", "credit_card", "cash"
      },
    });
  }

  async getChartData() {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

    const transactions = await model.findMany({
      where: { status: 'paid' },
      select: {
        amount: true,
        type: true,
        dueDate: true
      },
      orderBy: { dueDate: 'asc' }
    });

    const monthsLookup: { [key: string]: { month: string; faturamento: number; despesas: number } } = {};
    const labelMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    transactions.forEach((tx: any) => {
      const date = new Date(tx.dueDate);
      const monthLabel = labelMeses[date.getMonth()];

      if (!monthsLookup[monthLabel]) {
        monthsLookup[monthLabel] = { month: monthLabel, faturamento: 0, despesas: 0 };
      }

      const amountNum = Number(tx.amount || 0);

      if (tx.type === 'INCOME') {
        monthsLookup[monthLabel].faturamento += amountNum;
      } else if (tx.type === 'EXPENSE') {
        monthsLookup[monthLabel].despesas += amountNum;
      }
    });

    return Object.values(monthsLookup);
  }

}
