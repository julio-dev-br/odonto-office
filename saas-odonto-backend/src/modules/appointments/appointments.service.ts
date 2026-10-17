import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
