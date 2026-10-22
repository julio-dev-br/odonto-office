import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const client = this.prisma.tenantClient as any;
    const medicalRecordModel = client.medicalRecord || client.MedicalRecord;
    const procedureModel = client.dentalProcedure || client.DentalProcedure;
    const financialModel = client.financialTransaction || client.FinancialTransaction;

    if (!medicalRecordModel || !procedureModel || !financialModel) {
      throw new BadRequestException('Falha de inicialização relacional no Prisma Client mestre.');
    }

    const patientIdBigInt = BigInt(dto.patientId);
    const procedureIdBigInt = BigInt(dto.procedureId);
    const professionalIdBigInt = BigInt(dto.professionalId);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingRecord = await medicalRecordModel.findFirst({
      where: {
        patientId: patientIdBigInt,
        procedureId: procedureIdBigInt,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    if (existingRecord) {
      throw new BadRequestException('Este procedimento já foi registrado e assinado para este paciente na data de hoje.');
    }

    const procedureData = await procedureModel.findUnique({
      where: { id: procedureIdBigInt }
    });

    if (!procedureData) {
      throw new NotFoundException('Procedimento clínico não localizado no catálogo.');
    }

    const record = await medicalRecordModel.create({
      data: {
        patientId: patientIdBigInt,
        procedureId: procedureIdBigInt,
        professionalId: professionalIdBigInt,
        description: dto.description,
      }
    });

    await financialModel.create({
      data: {
        patientId: patientIdBigInt,
        description: `Faturamento automático: ${procedureData.name}`,
        amount: procedureData.price, // Herda o preço real do Postgres!
        type: 'INCOME',
        status: 'pending', 
        dueDate: new Date(),
        paymentMethod: 'pix'
      }
    });

    return record;
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
