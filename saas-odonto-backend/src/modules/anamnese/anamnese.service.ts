import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service'; // Mantém o caminho core exato!

@Injectable()
export class AnamneseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any) {
    const client = this.prisma.tenantClient as any;

    const model = client.anamnese || client.Anamnese || (this.prisma as any).anamnese || (this.prisma as any).Anamnese;

    if (!model) {
      throw new BadRequestException('Falha de inicialização relacional: O modelo Anamnese ainda não foi sincronizado no PrismaService mestre.');
    }

    const patientIdBigInt = BigInt(body.patientId);

    const existing = await model.findUnique({
      where: { patientId: patientIdBigInt },
    });

    if (existing) {
      throw new BadRequestException('Este paciente já possui uma Ficha de Anamnese respondida.');
    }

    return model.create({
      data: {
        patientId: patientIdBigInt, 
        hasAllergy: body.hasAllergy,
        allergyDetails: body.allergyDetails || 'Nenhuma',
        hasHeartDisease: body.hasHeartDisease,
        isHypertensive: body.isHypertensive,
        continuousMedication: body.continuousMedication || 'Nenhum',
        bleedingHistory: body.bleedingHistory,
      },
    });

  }

  async findByPatient(patientId: string) {
    const client = this.prisma.tenantClient as any;
    const model = client.anamnese || client.Anamnese || (this.prisma as any).anamnese || (this.prisma as any).Anamnese;

    if (!model) return null;

    const anamnese = await model.findUnique({
      where: { patientId: BigInt(patientId) },
    });

    if (!anamnese) return null;

    return anamnese;
  }
}
