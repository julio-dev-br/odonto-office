import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Patients') 
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new patient' })
  async create(@Body() body: { name: string; cpf?: string; whatsapp?: string }) {
    return this.patientsService.create(body);
  }

  @Get('paginated')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retrieve paginated and filtered patients for administration' })
  async findPaginated(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.patientsService.findPaginated({ page, limit, search, sort });
  }

  @Get()
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retrieve all patients filtered by clinic' })
  async findAll() {
    return this.patientsService.findAll();
  }


}
