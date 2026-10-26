import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { name: string; cpf?: string; whatsapp?: string }) {
    return this.prisma.tenantClient.patient.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        whatsapp: data.whatsapp,
      } as any,
    });
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.patient || client.Patient;

    return model.findMany({
      orderBy: { name: 'asc' },
    });
  }

}
