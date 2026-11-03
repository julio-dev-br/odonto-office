import { Controller, Post, Body, Get, Put, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tenants / Clinics (Gestão Global)')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) { }

  @Post('register')
  @ApiOperation({ summary: 'Self-register a new clinic and its primary administrator' })
  async register(@Body() body: CreateTenantDto) {
    return this.tenantsService.register(body);
  }

  @Get('current')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retorna os dados cadastrais e operacionais da clínica atual logada' })
  async getCurrentTenant(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.tenantsService.getCurrentTenant(tenantId);
  }

  @Put('settings')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualiza os parâmetros corporativos e o nome comercial da clínica atual' })
  async updateSettings(@Request() req: any, @Body() body: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.tenantsService.updateSettings(tenantId, body);
  }

}
