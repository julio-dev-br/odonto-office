import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessionalsService } from './professionals.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@ApiTags('Professionals (Dentistas / Funcionários)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Register a new clinical professional' })
  async create(@Body() body: CreateProfessionalDto) { 
    return this.professionalsService.create(body);
  }


  @Get()
  @Roles('ADMIN', 'DENTIST', 'RECEPTIONIST')
  @ApiOperation({ summary: 'List all active professionals for the current clinic' })
  async findAll() {
    return this.professionalsService.findAll();
  }
}
