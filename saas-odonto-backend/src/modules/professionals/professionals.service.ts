import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.professional || client.Professional;

    return model.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
