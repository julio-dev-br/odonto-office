import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@ApiTags('Medical Records (Prontuários)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) { }

  @Post()
  @Roles('ADMIN', 'DENTIST')
  @ApiOperation({ summary: 'Registra e assina digitalmente a evolução clínica do paciente' })
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  @Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Retrieve the clinical history timeline filtered by clinic' })
  async findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get('patient/:patientId')
  @Roles('ADMIN', 'DENTIST') 
  @ApiOperation({ summary: 'Retorna a linha do tempo histórica de procedimentos do paciente' })
  async findByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.findByPatient(patientId);
  }

}
