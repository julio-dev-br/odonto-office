import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClinicSitesService } from './clinic-sites.service';

@ApiTags('Clinic Sites (Landing Pages Customizáveis)')
@Controller('clinic-sites')
export class ClinicSitesController {
  constructor(private readonly clinicSitesService: ClinicSitesService) {}

  @Put('settings')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Update branding, palette and info for the current clinic landing page' })
  async updateSettings(@Body() body: any) {
    return this.clinicSitesService.updateSettings(body);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Fetch public landing page details and premium palette by clinic slug (No Token Required)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.clinicSitesService.findBySlug(slug);
  }
}
