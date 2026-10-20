import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class FinancialTransactionsService {
  constructor(private readonly prisma: PrismaService) { }

  // 1. Cria um lançamento (Receita de Paciente ou Despesa da Clínica)
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

    // Busca todas as transações financeiras da clínica atual (isolado pelo token)
    const transactions = await client.financialTransaction.findMany();

    let totalIncome = 0;
    let totalExpense = 0;

    // Converte e soma os valores de forma segura
    transactions.forEach((tx: any) => {
      const amountNum = Number(tx.amount);
      if (tx.type === 'INCOME') {
        totalIncome += amountNum;
      } else if (tx.type === 'EXPENSE') {
        totalExpense += amountNum;
      }
    });

    return {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      netBalance: Number((totalIncome - totalExpense).toFixed(2)),
    };
  }

  //Transforma uma transação pendente em PAGA!
  async payout(id: string, body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

    // Busca a transação garantindo o isolamento Multi-Tenant da clínica atual
    const transaction = await model.findFirst({
      where: { id: BigInt(id) },
    });

    if (!transaction) {
      throw new Error('Financial transaction not found for this clinic.');
    }

    // Executa a atualização com a data do recebimento e a forma de pagamento
    return model.update({
      where: { id: transaction.id },
      data: {
        status: 'paid', // Transforma o status para PAGO!
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(), // Padrão: Hoje
        paymentMethod: body.paymentMethod, // ex: "pix", "credit_card", "cash"
      },
    });
  }

  async getChartData() {
    const client = this.prisma.tenantClient as any;
    const model = client.financialTransaction || client.FinancialTransaction;

    // 📥 Busca todos os lançamentos pagos/liquidados do Tenant atual
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
      const monthLabel = labelMeses[date.getMonth()]; // Transforma o número do mês em sigla (Ex: 'Out')

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

    // Retorna o objeto convertido em Array limpo para o Axios ler
    return Object.values(monthsLookup);
  }

}
