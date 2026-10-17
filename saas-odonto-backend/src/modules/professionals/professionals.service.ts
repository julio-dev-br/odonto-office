import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Cadastra um profissional atrelado ao tenant do token
  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.professional || client.Professional;

    return model.create({
      data: {
        name: body.name,
        cro: body.cro,
        specialty: body.specialty,
        userId: body.userId ? BigInt(body.userId) : null,
        active: body.active !== undefined ? body.active : true,
      },
    });
  }

  // 2. Lista todos os profissionais ativos da clínica atual
  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.professional || client.Professional;

    return model.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
