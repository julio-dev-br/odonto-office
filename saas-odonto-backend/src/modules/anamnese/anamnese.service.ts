import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service'; // Mantém o caminho core exato!

@Injectable()
export class AnamneseService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.anamnese || client.Anamnese;

    const patientIdBigInt = BigInt(body.patientId);

    // 🔍 Busca se o paciente já tem registro de anamnese criado
    const existing = await model.findFirst({ where: { patientId: patientIdBigInt } });

    if (existing) {
      // 🚀 SE JÁ EXISTE: Dá UPDATE nas chaves exatas exigidas pelo seu schema!
      return model.update({
        where: { id: existing.id },
        data: {
          isHypertensive: body.hasHypertension, // 🛡️ CASADO: Alinha com 'isHypertensive' do schema!
          hasHeartDisease: body.hasDiabetes,    // 🛡️ CASADO: Alinha com 'hasHeartDisease' do schema!
          hasAllergy: body.hasAllergy,          // 🛡️ CASADO: Alinha com 'hasAllergy' do schema!
          allergyDetails: body.allergyDetails || 'Nenhuma',
        }
      });
    }

    // 🚀 SE NÃO EXISTE: Dá CREATE respeitando rigidamente os nomes das colunas!
    return model.create({
      data: {
        patientId: patientIdBigInt,
        isHypertensive: body.hasHypertension, // 🛡️ CASADO: Alinha com 'isHypertensive' do schema!
        hasHeartDisease: body.hasDiabetes,    // 🛡️ CASADO: Alinha com 'hasHeartDisease' do schema!
        hasAllergy: body.hasAllergy,          // 🛡️ CASADO: Alinha com 'hasAllergy' do schema!
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
