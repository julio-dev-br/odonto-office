import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Medical Records (Prontuários)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles('ADMIN', 'DENTIST')
  @ApiOperation({ summary: 'Add a clinical evolution entry and trigger auto finance charge' })
  async create(@Body() body: any) {
    // Passa o body direto, a inteligência do Tenant agora é resolvida de forma invisível pelo cofre no Service!
    return this.medicalRecordsService.create(body);
  }

  @Get()
  @Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Retrieve the clinical history timeline filtered by clinic' })
  async findAll() {
    return this.medicalRecordsService.findAll();
  }
}
