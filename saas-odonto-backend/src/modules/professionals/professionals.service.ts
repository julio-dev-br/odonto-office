import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) { }

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

  async getProcedures(professionalId: string) {
    const client = this.prisma.tenantClient as any;

    const professional = await client.professional.findUnique({
      where: { id: BigInt(professionalId) },
    });
    if (!professional) throw new NotFoundException('Profissional não encontrado.');

    const links = await client.professionalProcedure.findMany({
      where: { professionalId: BigInt(professionalId) },
      select: { procedureId: true },
    });

    return links.map((link: any) => link.procedureId.toString());
  }

  async updateProcedures(professionalId: string, procedureIds: string[]) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: BigInt(professionalId) },
    });
    if (!professional) throw new NotFoundException('Profissional não encontrado.');

    return this.prisma.$transaction(async (tx) => {
      await tx.professionalProcedure.deleteMany({
        where: { professionalId: BigInt(professionalId) },
      });

      for (const procId of procedureIds) {
        await tx.professionalProcedure.create({
          data: {
            tenantId: professional.tenantId,
            professionalId: BigInt(professionalId),
            procedureId: BigInt(procId),
          },
        });
      }
      
      return { message: 'Procedimentos atualizados com sucesso.' };
    });
  }
}
