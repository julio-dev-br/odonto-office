import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class DentalProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Cadastra um novo procedimento no catálogo da clínica logada
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

  // 2. Lista todos os procedimentos ativos do catálogo da clínica atual
  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.dentalProcedure || client.DentalProcedure;

    return model.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }, // Lista em ordem alfabética sênior
    });
  }
}
