import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnamneseService } from './anamnese.service';
import { RolesGuard } from '../auth/guards/roles.guard'; 
import { Roles } from '../auth/decorators/roles.decorator'; 
import { CreateAnamneseDto } from './dto/create-anamnese.dto';

@ApiTags('Histórico Clínico e Anamnese')
@ApiBearerAuth()
@Controller('anamnese')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
export class AnamneseController {
  constructor(private readonly anamneseService: AnamneseService) {}

  @Post()
  @Roles('ADMIN', 'DENTIST') 
  @ApiOperation({ summary: 'Cria ou atualiza a ficha de anamnese do paciente' })
  async create(@Body() body: any) {
    return this.anamneseService.createOrUpdate(body);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Retorna a ficha de anamnese filtrada isolada do paciente' })
  async findByPatient(@Param('patientId') patientId: string) {
    return this.anamneseService.findByPatient(patientId);
  }
}