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
  console.log('🌱 [Prisma v7] Iniciando carga de dados para homologação...');

  const tenantId = BigInt(1);

  // 🏢 1. Semeia Tenant Corporativo Mestre
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

  // 👤 2. SEMEIA O USUÁRIO DO DR. ANDERSON (Acesso)
  console.log('👤 Semeando Usuário Administrativo do Dr. Anderson...');
  const userAnderson = await prisma.user.upsert({
    where: { id: BigInt(3) } as any,
    update: {},
    create: {
      id: BigInt(3),
      tenantId,
      name: 'Dr. Anderson Silva',
      email: 'anderson@sorrisoperfeito.com',
      password: hashedDefaultPassword,
      role: 'ADMIN', // Papel administrativo total para o painel mestre
      active: true
    } as any
  });

  // 🩺 3. SEMEIA O REGISTRO PROFISSIONAL DO DR. ANDERSON (Atuação Clínica)
  console.log('🩺 Semeando Vínculo Clínico do Dr. Anderson...');
  await prisma.professional.upsert({
    where: { id: BigInt(1) } as any,
    update: {},
    create: {
      id: BigInt(1),
      tenantId,
      userId: BigInt(3), // Amarra com o usuário de ID 3 que criamos acima!
      name: 'Dr. Anderson Silva',
      cro: 'CRO-SP 12345',
      specialty: 'Ortodontia e Implantodontia',
      active: true // Sintonizado com o campo 'active' do seu schema!
    } as any
  });

  console.log('✨ Seed concluído com sucesso total! Dr. Anderson está ativo no banco!');
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
