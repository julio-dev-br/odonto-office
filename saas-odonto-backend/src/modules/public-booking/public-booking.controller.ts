import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicBookingService } from './public-booking.service';

@ApiTags('Agendamento Público')
@Controller('public-booking')
export class PublicBookingController {
  constructor(private readonly publicBookingService: PublicBookingService) {}

  @Get(':slug/data')
  @ApiOperation({ summary: 'Retorna profissionais e procedimentos para o agendamento online' })
  async getBookingData(@Param('slug') slug: string) {
    return this.publicBookingService.getBookingData(slug);
  }

  // 🚀 NOVA ROTA: Calcula os horários livres
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
}