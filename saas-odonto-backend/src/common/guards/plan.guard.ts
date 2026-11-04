import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../core/database/prisma.service';
import { REQUIRED_PLAN_KEY } from '../decorators/required-plan.decorator';
import { tenantStorage } from '../tenant/tenant.storage'; // 🚀 Importa o cofre

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(REQUIRED_PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlans || requiredPlans.length === 0) {
      return true;
    }

    // 🚀 AQUI ESTÁ A CORREÇÃO: Lê o ID diretamente do AsyncLocalStorage
    const tenantId = tenantStorage.getStore(); 

    if (!tenantId) {
      throw new ForbiddenException('Clínica não identificada no contexto da requisição.');
    }

    // Busca o plano no banco de dados usando o Prisma normal
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: BigInt(tenantId) },
      select: { plan: true },
    });

    if (!tenant) {
      throw new ForbiddenException('Clínica não encontrada.');
    }

    // Verifica se o plano atual bate com o exigido
    const currentPlan = tenant.plan.toLowerCase();
    const hasPermission = requiredPlans.map(p => p.toLowerCase()).includes(currentPlan);

    if (!hasPermission) {
      throw new ForbiddenException('Seu plano atual não permite acessar esta funcionalidade.');
    }

    return true;
  }
}