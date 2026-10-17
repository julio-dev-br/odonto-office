import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';

@ApiTags('Patients') 
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new patient' })
  async create(@Body() body: { name: string; cpf?: string; whatsapp?: string }) {
    return this.patientsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all patients from the current clinic' })
  async findAll() {
    return this.patientsService.findAll();
  }
}
