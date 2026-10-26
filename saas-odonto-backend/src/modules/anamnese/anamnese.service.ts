import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service'; 

@Injectable()
export class AnamneseService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.anamnese || client.Anamnese;

    const patientIdBigInt = BigInt(body.patientId);

    const existing = await model.findFirst({ where: { patientId: patientIdBigInt } });

    if (existing) {
      return model.update({
        where: { id: existing.id },
        data: {
          isHypertensive: body.hasHypertension, 
          hasHeartDisease: body.hasDiabetes,    
          hasAllergy: body.hasAllergy,          
          allergyDetails: body.allergyDetails || 'Nenhuma',
        }
      });
    }

    return model.create({
      data: {
        patientId: patientIdBigInt,
        isHypertensive: body.hasHypertension, 
        hasHeartDisease: body.hasDiabetes,    
        hasAllergy: body.hasAllergy,          
        allergyDetails: body.allergyDetails || 'Nenhuma',
      }
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
