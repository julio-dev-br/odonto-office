import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@ApiTags('Horários de Atendimento')
@Controller('schedules')
@ApiBearerAuth()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('professional/:professionalId')
  @ApiOperation({ summary: 'Busca a grade de horários de um profissional' })
  async getSchedules(@Param('professionalId') professionalId: string) {
    return this.schedulesService.getSchedules(professionalId);
  }

  @Post('professional/:professionalId')
  @ApiOperation({ summary: 'Cria ou atualiza o horário de um dia específico para o profissional' })
  async upsertSchedule(
    @Param('professionalId') professionalId: string,
    @Body() body: CreateScheduleDto,
  ) {
    return this.schedulesService.upsertSchedule(professionalId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a configuração de um horário' })
  async removeSchedule(@Param('id') id: string) {
    return this.schedulesService.removeSchedule('', id); // O professionalId não é estritamente necessário aqui pois o ID do schedule já é único
  }
}