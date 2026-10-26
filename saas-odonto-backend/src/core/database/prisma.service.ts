import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { tenantStorage } from '../../common/tenant/tenant.storage';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://saas_admin:SaasSecure2026@localhost:5433/saas_core_db?schema=public',
    });

    const adapter = new PrismaPg(pool);

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

            if (['findFirst', 'findUnique', 'findMany', 'update', 'delete', 'count'].includes(operation)) {
              currentArgs.where = { ...currentArgs.where, tenantId: tenantId };
            }

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
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
