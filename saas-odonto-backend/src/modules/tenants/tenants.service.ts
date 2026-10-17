import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(body: CreateTenantDto) {
    const { name, slug, adminName, adminEmail, adminPassword } = body;

    // 1. Validar se o slug já está em uso no ecossistema
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      throw new BadRequestException(`The slug '${slug}' is already taken by another clinic.`);
    }

    // 2. Criptografar a senha do dentista administrador
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 3. ENGENHARIA DE TRANSAÇÃO: Roda tudo junto ou desfaz tudo se der erro!
    return this.prisma.$transaction(async (tx) => {
      // A) Cria a Clínica (Tenant)
      const tenant = await tx.tenant.create({
        data: {
          name,
          slug,
          plan: 'starter',
          status: 'active',
        },
      });

      // B) Cria o Usuário Admin amarrado a essa clínica
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          active: true,
        },
      });

      // C) Cria o esqueleto do site da clínica (Landing Page Baseline)
      await tx.clinicSite.create({
        data: {
          tenantId: tenant.id,
          title: `Welcome to ${name}`,
          description: `Schedule your appointment online at ${name}. Professional dental care for your family.`,
          theme: 'light',
        },
      });

      return {
        message: 'Clinic and Administrator registered successfully!',
        tenant: {
          id: tenant.id.toString(),
          name: tenant.name,
          slug: tenant.slug,
        },
        admin: {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    });
  }
}
