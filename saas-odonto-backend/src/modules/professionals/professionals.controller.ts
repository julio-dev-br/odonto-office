import { Controller, Get, Post, Body, UseGuards, Param, Put } from '@nestjs/common';
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
  constructor(private readonly professionalsService: ProfessionalsService) { }

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

  @Get(':id/procedures')
  @Roles('ADMIN', 'DENTIST')
  @ApiOperation({ summary: 'List procedures associated with a professional' })
  async getProcedures(@Param('id') id: string) {
    console.log('🚀 A ROTA FOI CHAMADA! ID:', id);
    return this.professionalsService.getProcedures(id);
  }

  @Put(':id/procedures')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update the procedures associated with a professional' })
  async updateProcedures(
    @Param('id') id: string,
    @Body('procedureIds') procedureIds: string[]
  ) {
    return this.professionalsService.updateProcedures(id, procedureIds);
  }
}
