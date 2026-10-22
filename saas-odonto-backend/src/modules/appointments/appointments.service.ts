import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.appointment || client.Appointment;

    return model.create({
      data: {
        patientId: BigInt(body.patientId),
        professionalId: BigInt(body.professionalId || 1),
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        type: body.type,
        status: body.status || 'scheduled',
        notes: body.notes,
      },
    });
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.appointment || client.Appointment;

    return model.findMany({
      include: {
        patient: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  // Busca todas as consultas de hoje para o gerenciamento da recepção
  async findQueueToday() {
    const client = this.prisma.tenantClient as any;
    const model = client.appointment || client.Appointment;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return model.findMany({
      where: {
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  //Dá check-in, chama pro consultório ou finaliza a consulta
  async updateStatus(id: string, status: string) {
    const client = this.prisma.tenantClient as any;
    const appointmentModel = client.appointment || client.Appointment;
    const financialModel = client.financialTransaction || client.FinancialTransaction;

    // 1. Atualiza o status do agendamento na Fila da Recepção
    const updatedAppointment = await appointmentModel.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    if (status === 'completed') {
      await financialModel.updateMany({
        where: {
          patientId: updatedAppointment.patientId,
          status: 'pending' // Encontra a conta a receber que o médico gerou
        },
        data: {
          status: 'paid', // Liquida o caixa!
          updatedAt: new Date()
        }
      });
    }

    return updatedAppointment;
  }


}
