import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Quantos clientes totais temos?
    const totalTenants = await this.prisma.tenant.count();

    // 2. Quantos clientes estão ativos?
    const activeTenants = await this.prisma.tenant.count({
      where: { status: 'active' }
    });

    // 3. Buscamos a lista completa de clientes para listar na tabela do painel
    const tenants = await this.prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        status: true,
        createdAt: true,
        _count: {
          select: { users: true, patients: true } // Traz quantos usuários e pacientes cada clínica tem
        }
      },
      orderBy: { createdAt: 'desc' } // Os mais novos primeiro
    });

    // 4. Simulação de Faturamento (Como ainda não temos o Stripe integrado, calculamos com base no plano)
    // Se o plano for pro, conta 199, se for platinum, conta 349, etc.
    const planPrices: Record<string, number> = { starter: 99, pro: 199, platinum: 349 };
    let mrr = 0; // Monthly Recurring Revenue (Receita Recorrente Mensal)

    tenants.forEach(t => {
      if (t.status === 'active' && planPrices[t.plan.toLowerCase()]) {
        mrr += planPrices[t.plan.toLowerCase()];
      }
    });

    // 5. Distribuição de planos (Para um gráfico de pizza no futuro)
    const planDistribution = {
      starter: tenants.filter(t => t.plan.toLowerCase() === 'starter').length,
      pro: tenants.filter(t => t.plan.toLowerCase() === 'pro').length,
      platinum: tenants.filter(t => t.plan.toLowerCase() === 'platinum').length,
    };

    // Transforma os BigInts para String para o JSON não quebrar
    const formattedTenants = tenants.map(t => ({
      ...t,
      id: t.id.toString(),
      createdAt: t.createdAt.toISOString(),
    }));

    return {
      metrics: {
        totalTenants,
        activeTenants,
        mrr,
      },
      planDistribution,
      tenants: formattedTenants,
    };
  }
}