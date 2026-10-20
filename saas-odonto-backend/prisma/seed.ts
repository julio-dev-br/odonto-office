import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 [Prisma v7] Iniciando carga de dados históricos (Seed)...');

  const tenantId = BigInt(1);

  // 👑 SEED MESTRE MULTI-TENANT: Corrigido usando as propriedades exatas do seu banco!
  console.log('🏢 Semeando Tenant Corporativo mestre...');
  await prisma.tenant.upsert({
    where: { id: tenantId } as any,
    update: {},
    create: {
      id: tenantId,
      name: 'Sorriso Perfeito Clinic',
      slug: 'sorriso-perfeito',
      plan: 'PLATINUM',
      status: 'ACTIVE' // 🚀 AJUSTADO: Usa o campo status que o seu schema exige!
    } as any
  });

  // Limpa as movimentações anteriores para evitar duplicidades no gráfico
  await prisma.financialTransaction.deleteMany({
    where: { tenantId }
  });

  // 📅 Histórico cronológico estruturado para alimentar o Recharts do front-end
  const historyData = [
    // 📊 AGOSTO 2026
    { description: 'Mensalidade Aparelhos Ortodônticos - Lote 08', amount: 4500.00, type: 'INCOME', status: 'paid', date: '2026-08-15T14:00:00.000Z' },
    { description: 'Implante Dentário Elemento 21 - Entradas', amount: 3200.00, type: 'INCOME', status: 'paid', date: '2026-08-18T16:30:00.000Z' },
    { description: 'Fornecedor Dental Cremer - Insumos e Luvas', amount: 1200.00, type: 'EXPENSE', status: 'paid', date: '2026-08-05T10:00:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-08-10T09:00:00.000Z' },

    // 📊 SETEMBRO 2026
    { description: 'Tratamentos de Canal (Endodontia) - Convênios', amount: 6800.00, type: 'INCOME', status: 'paid', date: '2026-09-12T11:15:00.000Z' },
    { description: 'Próteses Dentárias Protocolo - Parcela 01', amount: 5500.00, type: 'INCOME', status: 'paid', date: '2026-09-25T15:45:00.000Z' },
    { description: 'Manutenção de Compressores e Cadeiras', amount: 850.00, type: 'EXPENSE', status: 'paid', date: '2026-09-08T14:20:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-09-10T09:00:00.000Z' },

    // 📊 OUTUBRO 2026 (Mês Atual)
    { description: 'Clareamento Dental Premium (Laser) - Dr. Anderson', amount: 850.00, type: 'INCOME', status: 'paid', date: '2026-10-15T10:00:00.000Z' },
    { description: 'Estética Dental Lentes de Resina - Entrada', amount: 8900.00, type: 'INCOME', status: 'paid', date: '2026-10-19T11:00:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-10-10T09:00:00.000Z' },
    { description: 'Marketing Digital e Campanhas Google Ads', amount: 1500.00, type: 'EXPENSE', status: 'paid', date: '2026-10-14T17:00:00.000Z' }
  ];

  console.log(`🚀 Injetando ${historyData.length} lançamentos financeiros no Postgres...`);

  // Percorre o array salvando os objetos com chaves estrangeiras perfeitamente válidas!
  for (const item of historyData) {
    await prisma.financialTransaction.create({
      data: {
        tenantId,
        description: item.description,
        amount: item.amount,
        type: item.type as any,
        status: item.status,
        dueDate: new Date(item.date),
        paymentMethod: 'pix'
      }
    });
  }

  console.log('✨ Seed financeiro executado com sucesso total!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
