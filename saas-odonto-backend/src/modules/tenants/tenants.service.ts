import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(body: CreateTenantDto) {
    const { name, slug, adminName, adminEmail, adminPassword } = body;

    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      throw new BadRequestException(`The slug '${slug}' is already taken by another clinic.`);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

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

  async getCurrentTenant(tenantId: string | number) {
    const targetTenantId = tenantId ? BigInt(tenantId) : BigInt(1);

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: targetTenantId },
      select: {
        id: true,
        name: true,
        plan: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new BadRequestException('Clinic not found.');
    }

    return {
      ...tenant,
      id: tenant.id.toString(),
    };
  }

  async updateSettings(tenantId: string | number, body: any) {
    const targetTenantId = tenantId ? BigInt(tenantId) : BigInt(1);

    if (!body.name || body.name.trim().length < 3) {
      throw new BadRequestException('The clinic name must have at least 3 characters.');
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { id: targetTenantId },
      data: {
        name: body.name,
      },
    });

    return {
      id: updatedTenant.id.toString(),
      name: updatedTenant.name,
      plan: updatedTenant.plan,
    };
  }

}
