import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { tenantStorage } from '../../common/tenant/tenant.storage';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const client = this.prisma.tenantClient as any;
    const medicalRecordModel = client.medicalRecord || client.MedicalRecord;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingRecord = await medicalRecordModel.findFirst({
      where: {
        patientId: dto.patientId.toString(),
        procedureId: dto.procedureId.toString(),
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });


    if (existingRecord) {
      throw new BadRequestException('Este procedimento já foi registrado e assinado para este paciente na data de hoje.');
    }

    const record = await medicalRecordModel.create({
      data: {
        patientId: dto.patientId.toString(),
        procedureId: dto.procedureId.toString(),
        professionalId: dto.professionalId.toString(),
        description: dto.description,
      }
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
