import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class FinancialTransactionsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

    const sanitizedMethod = body.paymentMethod ? String(body.paymentMethod).trim().toLowerCase() : null;

    const baseAmount = Number(body.amount);
    const totalInstallments = Number(body.totalInstallments) || 1;

    if (!body.description || !body.amount || !body.dueDate || !body.type) {
      throw new BadRequestException('Campos obrigatórios ausentes no lançamento financeiro.');
    }


    if (totalInstallments <= 1) {
      return model.create({
        data: {
          patientId: body.patientId ? BigInt(body.patientId) : null,
          recurrenceId: body.recurrenceId ? BigInt(body.recurrenceId) : null,
          treatmentId: body.treatmentId ? BigInt(body.treatmentId) : null,
          description: body.description,
          amount: baseAmount,
          type: body.type,
          status: body.status || 'pending',
          category: body.category || 'outros',
          paymentMethod: sanitizedMethod,
          dueDate: new Date(body.dueDate),
          paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
          installment: 1,
          totalInstallments: 1,
        },
      });
    }

    const installmentAmount = Number((baseAmount / totalInstallments).toFixed(2));
    const createdTransactions = [];
    const baseDueDate = new Date(body.dueDate);

    const autoLiquidateAll = sanitizedMethod === 'credit_card' || sanitizedMethod === 'debit_card';

    for (let i = 1; i <= totalInstallments; i++) {
      const currentDueDate = new Date(baseDueDate);
      currentDueDate.setMonth(baseDueDate.getMonth() + (i - 1));

      const shouldBePaid = autoLiquidateAll ? (body.status === 'paid') : (i === 1 && body.status === 'paid');

      const transaction = await model.create({
        data: {
          patientId: body.patientId ? BigInt(body.patientId) : null,
          recurrenceId: body.recurrenceId ? BigInt(body.recurrenceId) : null,
          treatmentId: body.treatmentId ? BigInt(body.treatmentId) : null,
          description: `${body.description} - Parcela ${String(i).padStart(2, '0')}/${String(totalInstallments).padStart(2, '0')}`,
          amount: installmentAmount,
          type: body.type,
          status: shouldBePaid ? 'paid' : 'pending',
          category: body.category || 'outros',
          paymentMethod: shouldBePaid ? sanitizedMethod : null, // 🚀 Grava a string limpa se estiver paga, ou null se for pendente futura
          dueDate: currentDueDate,
          paymentDate: shouldBePaid ? (body.paymentDate ? new Date(body.paymentDate) : new Date()) : null,
          installment: i,
          totalInstallments: totalInstallments,
        },
      });

      createdTransactions.push(transaction);
    }

    return {
      message: `${totalInstallments} parcelas geradas com sucesso no fluxo de caixa!`,
      totalAmount: baseAmount,
      installmentsGenerated: createdTransactions.length,
      methodApplied: sanitizedMethod,
    };
  }

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
        status: 'paid',
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

  async searchPatients() {
    const client = this.prisma.tenantClient as any;
    return client.patient.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async searchProcedures() {
    const client = this.prisma.tenantClient as any;
    return client.dentalProcedure.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
      orderBy: { name: 'asc' },
    });
  }


}
