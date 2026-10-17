import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { name: string; cpf?: string; whatsapp?: string }) {
    return this.prisma.tenantClient.patient.create({
      // Usamos 'as any' para o TypeScript permitir o fluxo dinâmico da extensão
      data: {
        name: data.name,
        cpf: data.cpf,
        whatsapp: data.whatsapp,
      } as any,
    });
  }

  // Lista APENAS os pacientes pertencentes à clínica atual
  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.patient || client.Patient;

    return model.findMany({
      orderBy: { name: 'asc' },
    });
  }

}
