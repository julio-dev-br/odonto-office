import { Controller, Get, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Agenda de Consultas')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Create a new appointment scheduling' })
  async create(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.create(body);
  }

  @Get('queue')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retorna a fila de espera e consultas do dia atual' })
  async getQueueToday() {
    return this.appointmentsService.findQueueToday();
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Atualiza o status do paciente na fila (check-in, atendimento, finalizado)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna a grade de agendamentos isolada da clínica atual' })
  async findAll() {
    return this.appointmentsService.findAll();
  }
}
