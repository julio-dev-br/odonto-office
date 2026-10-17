import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@ApiTags('Tenants / Clinics (Gestão Global)') // Sem ApiBearerAuth pois é pública!
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Self-register a new clinic and its primary administrator' })
  async register(@Body() body: CreateTenantDto) {
    return this.tenantsService.register(body);
  }
}
