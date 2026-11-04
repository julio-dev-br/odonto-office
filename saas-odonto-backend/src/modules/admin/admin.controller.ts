import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator'; 
import { AdminService } from './admin.service'; // 🚀 Importa o Service

@ApiTags('Super Admin (Backoffice)')
@Controller('admin')
@UseGuards(RolesGuard) 
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {} // 🚀 Injeta o Service

  @Get('stats')
  @Roles('SUPER_ADMIN') 
  @ApiOperation({ summary: 'Retorna métricas globais do SaaS (Apenas Super Admin)' })
  async getGlobalStats() {
    // 🚀 Chama a função que criamos no Service
    return this.adminService.getDashboardStats();
  }
}