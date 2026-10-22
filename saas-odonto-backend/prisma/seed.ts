import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 [Prisma v7] Iniciando carga de dados históricos (Seed)...');

  const tenantId = BigInt(1);

  // 1. Semeia Tenant Corporativo mestre
  console.log('🏢 Semeando Tenant Corporativo mestre...');
  await prisma.tenant.upsert({
    where: { id: tenantId } as any,
    update: {},
    create: {
      id: tenantId,
      name: 'Sorriso Perfeito Clinic',
      slug: 'sorriso-perfeito',
      plan: 'PLATINUM',
      status: 'ACTIVE'
    } as any
  });

  // 🔒 Criptografa a senha padrão de teste do Dr. Anderson
  const hashedDefaultPassword = await bcrypt.hash('odonto123', 10);

  // 👤 2. SEMEIA O USUÁRIO DO DR. ANDERSON NO POSTGRES
  console.log('👤 Semeando Usuário do Dr. Anderson...');
  const userAnderson = await prisma.user.upsert({
    where: { id: BigInt(3) } as any,
    update: {},
    create: {
      id: BigInt(3),
      tenantId,
      name: 'Dr. Anderson Silva',
      email: 'anderson@sorrisoperfeito.com',
      password: hashedDefaultPassword,
      role: 'DENTIST',
      active: true
    } as any
  });

  // 🩺 3. RELAÇÃO COMPLEMENTAR: Cria o Dr. Anderson na tabela de Profissionais/Dentistas!
  console.log('🩺 Semeando Registro Profissional do Dr. Anderson...');
  await prisma.professional.upsert({
    where: { id: BigInt(1) } as any, // ID único do profissional
    update: {},
    create: {
      id: BigInt(1),
      tenantId,
      userId: BigInt(3), // Amarra com o ID do usuário que criamos acima!
      name: 'Dr. Anderson Silva',
      cro: 'CRO-SP 12345', // Registro obrigatório do conselho!
      specialty: 'Ortodontia e Implantodontia',
      isActive: true
    } as any
  });


  // Limpa as movimentações anteriores para evitar duplicidades no gráfico
  await prisma.financialTransaction.deleteMany({
    where: { tenantId }
  });

  // Histórico cronológico estruturado para alimentar o Recharts do front-end
  const historyData = [
    // AGOSTO 2026
    { description: 'Mensalidade Aparelhos Ortodônticos - Lote 08', amount: 4500.00, type: 'INCOME', status: 'paid', date: '2026-08-15T14:00:00.000Z' },
    { description: 'Implante Dentário Elemento 21 - Entradas', amount: 3200.00, type: 'INCOME', status: 'paid', date: '2026-08-18T16:30:00.000Z' },
    { description: 'Fornecedor Dental Cremer - Insumos e Luvas', amount: 1200.00, type: 'EXPENSE', status: 'paid', date: '2026-08-05T10:00:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-08-10T09:00:00.000Z' },

    // SETEMBRO 2026
    { description: 'Tratamentos de Canal (Endodontia) - Convênios', amount: 6800.00, type: 'INCOME', status: 'paid', date: '2026-09-12T11:15:00.000Z' },
    { description: 'Próteses Dentárias Protocolo - Parcela 01', amount: 5500.00, type: 'INCOME', status: 'paid', date: '2026-09-25T15:45:00.000Z' },
    { description: 'Manutenção de Compressores e Cadeiras', amount: 850.00, type: 'EXPENSE', status: 'paid', date: '2026-09-08T14:20:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-09-10T09:00:00.000Z' },

    // OUTUBRO 2026 (Mês Atual)
    { description: 'Clareamento Dental Premium (Laser) - Dr. Anderson', amount: 850.00, type: 'INCOME', status: 'paid', date: '2026-10-15T10:00:00.000Z' },
    { description: 'Estética Dental Lentes de Resina - Entrada', amount: 8900.00, type: 'INCOME', status: 'paid', date: '2026-10-19T11:00:00.000Z' },
    { description: 'Aluguel Comercial da Sala 402', amount: 2500.00, type: 'EXPENSE', status: 'paid', date: '2026-10-10T09:00:00.000Z' },
    { description: 'Marketing Digital e Campanhas Google Ads', amount: 1500.00, type: 'EXPENSE', status: 'paid', date: '2026-10-14T17:00:00.000Z' }
  ];

  console.log(`🚀 Injetando ${historyData.length} lançamentos financeiros no Postgres...`);

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

  console.log('✨ Seed financeiro e de usuários executado com sucesso total!');
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
