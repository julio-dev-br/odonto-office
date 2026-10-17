import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { tenantStorage } from '../../common/tenant/tenant.storage';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Cria a piscina de conexões nativa do driver 'pg'
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://saas_admin:SaasSecure2026@localhost:5433/saas_core_db?schema=public',
    });

    // 2. Instancia o adaptador exigido pelo Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Passa o adaptador para o construtor do PrismaClient
    super({ adapter });
  }

  public readonly tenantClient = this.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantIdStr = tenantStorage.getStore();

          if (tenantIdStr && model !== 'Tenant') {
            const tenantId = BigInt(tenantIdStr);
            const currentArgs = (args || {}) as any;

            // Injeta o filtro tenantId automaticamente nas operações de leitura/edição/deleção
            if (['findFirst', 'findUnique', 'findMany', 'update', 'delete', 'count'].includes(operation)) {
              currentArgs.where = { ...currentArgs.where, tenantId: tenantId };
            }
            // Injeta o tenantId automaticamente na criação de registros
            if (['create', 'createMany'].includes(operation)) {
              currentArgs.data = { ...currentArgs.data, tenantId: tenantId };
            }
          }

          return query(args);
        },
      },
    },
  });


  async onModuleInit() {
    // A conexão agora é gerenciada de forma transparente pelo driver adapter
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
