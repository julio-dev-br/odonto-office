import { Controller, Get, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicSitesService } from './clinic-sites.service';
import { UpdateClinicSiteDto } from './dto/update-clinic-site.dto';
import { PlanGuard } from '../../common/guards/plan.guard';
import { RequiredPlan } from '../../common/decorators/required-plan.decorator';

@ApiTags('Clinic Sites (Landing Pages Customizáveis)')
@Controller('clinic-sites')
@UseGuards(PlanGuard) // 🚀 Aplica o Guard em todas as rotas deste controller
export class ClinicSitesController {
  constructor(private readonly clinicSitesService: ClinicSitesService) {}

  @Get('me')
  @ApiBearerAuth() 
  @RequiredPlan('pro', 'platinum') // 🚀 Bloqueia se o plano não for Pro ou Platinum
  @ApiOperation({ summary: 'Busca as configurações do site da clínica logada' })
  async getMySite() {
    return this.clinicSitesService.getMySite();
  }

  @Put('settings')
  @ApiBearerAuth() 
  @RequiredPlan('pro', 'platinum') // 🚀 Bloqueia se o plano não for Pro ou Platinum
  @ApiOperation({ summary: 'Atualiza as configurações do site da clínica logada' })
  async updateSettings(@Body() body: UpdateClinicSiteDto) {
    return this.clinicSitesService.updateSettings(body);
  }

  @Patch('publish')
  @ApiBearerAuth() 
  @RequiredPlan('pro', 'platinum') // 🚀 Bloqueia se o plano não for Pro ou Platinum
  @ApiOperation({ summary: 'Publica ou desativa o site da clínica' })
  async togglePublish(@Body('isPublished') isPublished: boolean) {
    return this.clinicSitesService.togglePublish(isPublished);
  }

  // 🚀 Rota Pública: Não tem o @RequiredPlan, então o PlanGuard deixa passar.
  @Get('public/:slug')
  @ApiOperation({ summary: 'Busca os dados públicos do site pelo slug da clínica' })
  async findBySlug(@Param('slug') slug: string) {
    return this.clinicSitesService.findBySlug(slug);
  }
}