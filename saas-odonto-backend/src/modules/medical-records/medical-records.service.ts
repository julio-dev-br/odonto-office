import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: any) {
    const client = this.prisma.tenantClient as any;
    
    const patientIdBigInt = BigInt(dto.patientId);
    const procedureIdBigInt = BigInt(dto.procedureId);
    let professionalIdInput = BigInt(dto.professionalId);

    // 1. Alinha o ID do profissional
    const verifiedProfessional = await client.professional.findFirst({
      where: { OR: [{ id: professionalIdInput }, { userId: professionalIdInput }] }
    });
    if (!verifiedProfessional) throw new NotFoundException('Dentista não localizado.');
    const professionalIdBigInt = verifiedProfessional.id;

    // 2. Grava a Evolução Clínica no Prontuário
    const record = await client.medicalRecord.create({
      data: {
        patientId: patientIdBigInt,
        procedureId: procedureIdBigInt,
        professionalId: professionalIdBigInt,
        description: dto.description,
      }
    });

    // 🚀 INJEÇÃO DE REGRA DE NEGÓCIO: Se NÃO for apenas orçamento, gera o financeiro pendente!
    if (!dto.isBudget) {
      const procedureData = await client.dentalProcedure.findUnique({ where: { id: procedureIdBigInt } });
      if (procedureData) {
        await client.financialTransaction.create({
          data: {
            patientId: patientIdBigInt,
            description: `Faturamento automático: ${procedureData.name}`,
            amount: procedureData.price,
            type: 'INCOME',
            status: 'pending',
            dueDate: new Date(),
            paymentMethod: 'pix'
          }
        });
      }
    }

    // 🚀 LIBERAÇÃO DA CADEIRA: Procura o agendamento ativo de hoje e joga para a recepção liberar a saída!
    await client.appointment.updateMany({
      where: {
        patientId: patientIdBigInt,
        status: 'in_attendance'
      },
      data: { status: 'waiting_checkout' }
    });

    return record;
  }


  async findByPatient(patientId: string) {
    const client = this.prisma.tenantClient as any;
    const model = client.medicalRecord || client.MedicalRecord;

    return model.findMany({
      where: { patientId: BigInt(patientId) },
      include: {
        procedure: {
          select: { name: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' } 
    });
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.medicalRecord || client.MedicalRecord;

    return model.findMany({
      include: {
        patient: {
          select: { name: true },
        },
        procedure: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
