import { Controller, Get, Post, Param, Query, Body, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PublicBookingService } from './public-booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Agendamento Público')
@Controller('public-booking')
export class PublicBookingController {
  constructor(private readonly publicBookingService: PublicBookingService) {}

  @Get(':slug/data')
  @ApiOperation({ summary: 'Retorna profissionais e procedimentos para o agendamento online' })
  async getBookingData(@Param('slug') slug: string) {
    return this.publicBookingService.getBookingData(slug);
  }

  @Get(':slug/availability')
  @ApiOperation({ summary: 'Retorna os horários disponíveis para um profissional, procedimento e data' })
  async getAvailability(
    @Param('slug') slug: string,
    @Query('professionalId') professionalId: string,
    @Query('procedureId') procedureId: string,
    @Query('date') date: string,
  ) {
    return this.publicBookingService.getAvailability(slug, professionalId, procedureId, date);
  }

  // 🚀 NOVA ROTA: Criar o agendamento
  @Post(':slug/book')
  @ApiOperation({ summary: 'Cria um novo agendamento a partir do site público' })
  // 🛡️ SEGURANÇA: Limita a 5 agendamentos por minuto por IP para evitar ataques
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async createBooking(
    @Param('slug') slug: string,
    @Body() body: CreateBookingDto,
    @Ip() ip: string, // Captura o IP do paciente para segurança
  ) {
    return this.publicBookingService.createBooking(slug, body);
  }
}