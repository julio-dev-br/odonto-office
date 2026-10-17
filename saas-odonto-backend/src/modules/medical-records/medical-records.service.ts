import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { tenantStorage } from '../../common/tenant/tenant.storage';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

 
  async create(body: any) {
    const tenantIdStr = tenantStorage.getStore() as any;
    const tenantIdStrClean = typeof tenantIdStr === 'string' ? tenantIdStr : '1'; 
    const tenantId = BigInt(tenantIdStrClean);

    
    return this.prisma.$transaction(async (tx) => {
      const patientId = BigInt(body.patientId);
      const procedureId = (body.procedureId || body.procedure_id) ? BigInt(body.procedureId || body.procedure_id) : null;
      
      
      const professionalId = BigInt(body.professionalId || body.professional_id || 1);

      let procedurePrice = 0;
      let procedureName = 'Procedimento Geral';

      
      if (procedureId) {
        const procedure = await tx.dentalProcedure.findFirst({
          where: { 
            id: procedureId,
            tenantId: tenantId 
          },
        });

        if (!procedure) {
          throw new NotFoundException(`Procedure with ID ${procedureId} not found in this clinic's catalog.`);
        }

        procedurePrice = Number(procedure.price);
        procedureName = procedure.name;
      }


      const medicalRecord = await tx.medicalRecord.create({
        data: {
          tenantId, 
          patientId,
          procedureId,
          professionalId, 
          description: body.description,
        },
      });


      if (procedurePrice > 0) {
        await tx.financialTransaction.create({
          data: {
            tenantId, 
            patientId,
            description: `Ref: ${procedureName} (Evolução Clínica)`,
            amount: procedurePrice,
            type: 'INCOME',    
            status: 'pending', 
            dueDate: new Date(), 
          },
        });
      }

      return {
        message: procedurePrice > 0 
          ? 'Medical record saved and financial transaction generated automatically!' 
          : 'Medical record saved successfully.',
        medicalRecord: {
          id: medicalRecord.id.toString(),
          patientId: medicalRecord.patientId.toString(),
          procedureId: medicalRecord.procedureId?.toString() || null,
          professionalId: medicalRecord.professionalId.toString(),
          description: medicalRecord.description,
        },
        financialTrigger: procedurePrice > 0 ? {
          amount: procedurePrice,
          status: 'pending',
          description: `Ref: ${procedureName} (Evolução Clínica)`
        } : null
      };
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
