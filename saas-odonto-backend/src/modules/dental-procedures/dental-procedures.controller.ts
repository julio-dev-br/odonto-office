import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DentalProceduresService } from './dental-procedures.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dental Procedures (Catálogo de Preços)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('dental-procedures')
export class DentalProceduresController {
  constructor(private readonly dentalProceduresService: DentalProceduresService) {}

  @Post()
  @Roles('ADMIN', 'DENTIST') 
  @ApiOperation({ summary: 'Create a new procedure with pricing and estimated time' })
  async create(@Body() body: any) {
    return this.dentalProceduresService.create(body);
  }

  @Get()
  @Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
  @ApiOperation({ summary: 'List all active procedures for the current clinic' })
  async findAll() {
    return this.dentalProceduresService.findAll();
  }
}
