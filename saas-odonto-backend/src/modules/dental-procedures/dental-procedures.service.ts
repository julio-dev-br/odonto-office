import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class DentalProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.dentalProcedure || client.DentalProcedure;

    return model.create({
      data: {
        name: body.name,                 
        description: body.description,   
        price: body.price,               
        estimatedMin: body.estimatedMin || 60, 
        active: body.active !== undefined ? body.active : true,
      },
    });
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.dentalProcedure || client.DentalProcedure;

    return model.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
