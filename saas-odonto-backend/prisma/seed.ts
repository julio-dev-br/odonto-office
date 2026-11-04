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

  const defaultPassword = await bcrypt.hash('odonto123', 10);

  // ==========================================
  // 1. CRIANDO AS CLÍNICAS (TENANTS)
  // ==========================================
  console.log('🏢 Semeando Clínicas (Tenants)...');

  const tenantGFL = await prisma.tenant.upsert({
    where: { slug: 'gfl-sistemas' },
    update: {},
    create: {
      name: 'GFL Sistemas (Backoffice)',
      slug: 'gfl-sistemas',
      plan: 'platinum',
      status: 'active',
    }
  });

  const tenantClinica = await prisma.tenant.upsert({
    where: { slug: 'sorriso-perfeito' },
    update: {},
    create: {
      name: 'Sorriso Perfeito Clinic',
      slug: 'sorriso-perfeito',
      plan: 'platinum',
      status: 'active',
    }
  });

  // ==========================================
  // 2. CRIANDO OS SITES DAS CLÍNICAS
  // ==========================================
  console.log('🌐 Semeando Configurações de Sites...');
  
  await prisma.clinicSite.upsert({
    where: { tenantId: tenantGFL.id },
    update: {},
    create: {
      tenantId: tenantGFL.id,
      title: 'GFL Sistemas',
      isPublished: false,
    }
  });

  await prisma.clinicSite.upsert({
    where: { tenantId: tenantClinica.id },
    update: {},
    create: {
      tenantId: tenantClinica.id,
      title: 'Sorriso Perfeito Clinic',
      description: 'Sua clínica odontológica de alta performance.',
      isPublished: true,
      primaryColor: '#0F172A',
      accentColor: '#10B981',
    }
  });

  // ==========================================
  // 3. CRIANDO OS USUÁRIOS
  // ==========================================
  console.log('👤 Semeando Usuários...');

  // 3.1. SUPER ADMINS
  const superAdmins = [
    { name: 'Gustavo Ferreira', email: 'gustavo@gflsistemas.com.br' },
    { name: 'Admin Global 2', email: 'admin2@gflsistemas.com.br' },
    { name: 'Admin Global 3', email: 'admin3@gflsistemas.com.br' },
  ];

  for (const admin of superAdmins) {
    await prisma.user.upsert({
      // 🚀 Correção: Usando a chave composta exata do schema (uk_users_email)
      where: { 
        uk_users_email: {
          tenantId: tenantGFL.id,
          email: admin.email
        }
      },
      update: {},
      create: {
        tenantId: tenantGFL.id,
        name: admin.name,
        email: admin.email,
        password: defaultPassword,
        role: 'SUPER_ADMIN',
        active: true,
      }
    });
  }

  // 3.2. ADMINS DE CLÍNICA
  const clinicAdmins = [
    { name: 'Dr. Anderson Silva', email: 'anderson@sorrisoperfeito.com' },
    { name: 'Dra. Maria Souza', email: 'maria@sorrisoperfeito.com' },
    { name: 'Dr. Carlos Lima', email: 'carlos@sorrisoperfeito.com' },
  ];

  for (const admin of clinicAdmins) {
    await prisma.user.upsert({
      where: { 
        uk_users_email: {
          tenantId: tenantClinica.id,
          email: admin.email
        }
      },
      update: {},
      create: {
        tenantId: tenantClinica.id,
        name: admin.name,
        email: admin.email,
        password: defaultPassword,
        role: 'ADMIN',
        active: true,
      }
    });
  }

  // 3.3. DENTISTAS
  const dentists = [
    { name: 'Dr. João Dentista', email: 'joao@sorrisoperfeito.com', specialty: 'Ortodontia', cro: 'CRO-SP 11111' },
    { name: 'Dra. Ana Dentista', email: 'ana@sorrisoperfeito.com', specialty: 'Endodontia', cro: 'CRO-SP 22222' },
    { name: 'Dr. Pedro Dentista', email: 'pedro@sorrisoperfeito.com', specialty: 'Implantodontia', cro: 'CRO-SP 33333' },
  ];

  for (const dentista of dentists) {
    const userDentista = await prisma.user.upsert({
      where: { 
        uk_users_email: {
          tenantId: tenantClinica.id,
          email: dentista.email
        }
      },
      update: {},
      create: {
        tenantId: tenantClinica.id,
        name: dentista.name,
        email: dentista.email,
        password: defaultPassword,
        role: 'DENTIST',
        active: true,
      }
    });

    // 🚀 Correção: userId não é @unique, então usamos findFirst e create
    const existingProfessional = await prisma.professional.findFirst({
      where: { userId: userDentista.id }
    });

    if (!existingProfessional) {
      await prisma.professional.create({
        data: {
          tenantId: tenantClinica.id,
          userId: userDentista.id,
          name: dentista.name,
          specialty: dentista.specialty,
          cro: dentista.cro,
          active: true,
        }
      });
    }
  }

  console.log('✨ Seed concluído com sucesso total!');
  console.log('----------------------------------------------------');
  console.log('🔑 Senha padrão para todos os usuários: odonto123');
  console.log('----------------------------------------------------');
  console.log('🛡️ Super Admins (Painel Backoffice):');
  console.log('   - gustavo@gflsistemas.com.br (Tenant ID: ' + tenantGFL.id + ')');
  console.log('   - admin2@gflsistemas.com.br (Tenant ID: ' + tenantGFL.id + ')');
  console.log('   - admin3@gflsistemas.com.br (Tenant ID: ' + tenantGFL.id + ')');
  console.log('----------------------------------------------------');
  console.log('🏢 Admins da Clínica (Painel Cliente):');
  console.log('   - anderson@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('   - maria@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('   - carlos@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('----------------------------------------------------');
  console.log('🦷 Dentistas (Painel Cliente):');
  console.log('   - joao@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('   - ana@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('   - pedro@sorrisoperfeito.com (Tenant ID: ' + tenantClinica.id + ')');
  console.log('----------------------------------------------------');
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