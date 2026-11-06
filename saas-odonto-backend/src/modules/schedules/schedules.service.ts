import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) { }

  // 1. Busca todos os horários configurados de um profissional
  async getSchedules(professionalId: string) {
    // 🚀 Cast para any para o TypeScript aceitar o tenantClient
    const client = this.prisma.tenantClient as any;

    const schedules = await client.professionalSchedule.findMany({
      where: { professionalId: BigInt(professionalId) },
      orderBy: { dayOfWeek: 'asc' },
    });

    return schedules.map((schedule: any) => ({
      ...schedule,
      id: schedule.id.toString(),
      tenantId: schedule.tenantId.toString(),
      professionalId: schedule.professionalId.toString(),
    }));
  }

  // 2. Cria ou atualiza a configuração de um dia específico
  async upsertSchedule(professionalId: string, data: CreateScheduleDto) {
    const client = this.prisma.tenantClient as any;

    // Verifica se o profissional existe
    const professionalExists = await client.professional.findUnique({
      where: { id: BigInt(professionalId) },
    });

    if (!professionalExists) {
      throw new NotFoundException('Profissional não encontrado nesta clínica.');
    }

    // 1. Busca se já existe uma configuração para este dia
    const existingSchedule = await client.professionalSchedule.findFirst({
      where: {
        professionalId: BigInt(professionalId),
        dayOfWeek: data.dayOfWeek,
      },
    });

    let schedule;

    // 2. Se existir, atualiza
    if (existingSchedule) {
      schedule = await client.professionalSchedule.update({
        where: { id: existingSchedule.id },
        data: {
          startTime: data.startTime,
          endTime: data.endTime,
          breakStart: data.breakStart,
          breakEnd: data.breakEnd,
          active: data.active ?? true,
        },
      });
    } else {
      // 3. Se não existir, cria (e o tenantClient injeta o tenantId automaticamente)
      schedule = await client.professionalSchedule.create({
        data: {
          professionalId: BigInt(professionalId),
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          breakStart: data.breakStart,
          breakEnd: data.breakEnd,
          active: data.active ?? true,
        },
      });
    }

    return {
      ...schedule,
      id: schedule.id.toString(),
      tenantId: schedule.tenantId.toString(),
      professionalId: schedule.professionalId.toString(),
    };
  }

  // 3. Remove a configuração de um dia
  async removeSchedule(professionalId: string, scheduleId: string) {
    const client = this.prisma.tenantClient as any;

    const schedule = await client.professionalSchedule.findUnique({
      where: { id: BigInt(scheduleId) },
    });

    if (!schedule) {
      throw new NotFoundException('Horário não encontrado.');
    }

    await client.professionalSchedule.delete({
      where: { id: BigInt(scheduleId) },
    });

    return { message: 'Horário removido com sucesso.' };
  }
}