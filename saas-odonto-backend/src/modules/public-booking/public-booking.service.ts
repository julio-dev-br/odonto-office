import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class PublicBookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookingData(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException('Clínica não encontrada.');

    const professionals = await this.prisma.professional.findMany({
      where: { tenantId: tenant.id, active: true },
      include: { procedures: true },
    });

    const procedures = await this.prisma.dentalProcedure.findMany({
      where: { tenantId: tenant.id, active: true },
    });

    return {
      clinicName: tenant.name,
      professionals: professionals.map((prof) => ({
        id: prof.id.toString(),
        name: prof.name,
        specialty: prof.specialty,
        bufferTime: prof.bufferTime,
        procedures: prof.procedures.map((p) => p.procedureId.toString()),
      })),
      procedures: procedures.map((proc) => ({
        id: proc.id.toString(),
        name: proc.name,
        price: proc.price,
        estimatedMin: proc.estimatedMin,
      })),
    };
  }

  async getAvailability(slug: string, professionalId: string, procedureId: string, dateStr: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException('Clínica não encontrada.');

    const procedure = await this.prisma.dentalProcedure.findFirst({
      where: { id: BigInt(procedureId), tenantId: tenant.id },
    });
    if (!procedure) throw new NotFoundException('Procedimento não encontrado.');

    const professional = await this.prisma.professional.findFirst({
      where: { id: BigInt(professionalId), tenantId: tenant.id },
    });
    if (!professional) throw new NotFoundException('Profissional não encontrado.');

    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return { availableSlots: [] };

    const exception = await this.prisma.scheduleException.findFirst({
      where: {
        professionalId: BigInt(professionalId),
        date: date,
      },
    });

    // 🚀 CORREÇÃO: Tipagem explícita e verificação de nulos
    let workStart: string;
    let workEnd: string;
    let breakStart: string | null = null;
    let breakEnd: string | null = null;

    if (exception) {
      // Se a exceção for folga ou não tiver horário definido, não há atendimento
      if (!exception.isAvailable || !exception.startTime || !exception.endTime) {
        return { availableSlots: [] };
      }
      workStart = exception.startTime;
      workEnd = exception.endTime;
    } else {
      const schedule = await this.prisma.professionalSchedule.findUnique({
        where: {
          professionalId_dayOfWeek: {
            professionalId: BigInt(professionalId),
            dayOfWeek: dayOfWeek,
          },
        },
      });

      if (!schedule || !schedule.active) {
        return { availableSlots: [] };
      }

      workStart = schedule.startTime;
      workEnd = schedule.endTime;
      breakStart = schedule.breakStart;
      breakEnd = schedule.breakEnd;
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        professionalId: BigInt(professionalId),
        startAt: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ['cancelled', 'completed'] },
      },
    });

    const timeToMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const minutesToTime = (minutes: number) => {
      const h = Math.floor(minutes / 60).toString().padStart(2, '0');
      const m = (minutes % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    // Agora o TypeScript sabe com certeza que workStart e workEnd são strings
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    
    const totalDuration = procedure.estimatedMin + (professional.bufferTime || 10);

    let currentMin = startMin;
    const availableSlots: string[] = [];

    const now = new Date();
    const isToday = date.getTime() === today.getTime();
    const minTimeAllowed = isToday ? (now.getHours() * 60 + now.getMinutes()) + 120 : 0;

    while (currentMin + totalDuration <= endMin) {
      const slotStart = currentMin;
      const slotEnd = currentMin + totalDuration;

      let hasBreakConflict = false;
      if (breakStart && breakEnd) {
        const breakStartMin = timeToMinutes(breakStart);
        const breakEndMin = timeToMinutes(breakEnd);
        if (slotStart < breakEndMin && slotEnd > breakStartMin) {
          hasBreakConflict = true;
        }
      }

      let hasAppointmentConflict = false;
      for (const appt of existingAppointments) {
        const apptStart = appt.startAt.getHours() * 60 + appt.startAt.getMinutes();
        const apptEnd = appt.endAt.getHours() * 60 + appt.endAt.getMinutes();
        
        const apptEndWithBuffer = apptEnd + (professional.bufferTime || 10);

        if (slotStart < apptEndWithBuffer && slotEnd > apptStart) {
          hasAppointmentConflict = true;
          break;
        }
      }

      if (!hasBreakConflict && !hasAppointmentConflict && slotStart >= minTimeAllowed) {
        availableSlots.push(minutesToTime(slotStart));
      }

      currentMin += 30;
    }

    return { availableSlots };
  }
}