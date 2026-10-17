import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
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
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Create a new appointment scheduling' })
  async create(@Body() body: CreateAppointmentDto) { 
    return this.appointmentsService.create(body);
  }


  @Get()
  @ApiOperation({ summary: 'Retorna a grade de agendamentos isolada da clínica atual' })
  async findAll() {
    return this.appointmentsService.findAll();
  }
}
