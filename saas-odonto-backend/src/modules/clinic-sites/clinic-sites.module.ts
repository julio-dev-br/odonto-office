import { Module } from '@nestjs/common';
import { ClinicSitesService } from './clinic-sites.service';
import { ClinicSitesController } from './clinic-sites.controller';
import { PrismaService } from '../../core/database/prisma.service';
import { PlanGuard } from '../../common/guards/plan.guard';

@Module({
  controllers: [ClinicSitesController],
  providers: [ClinicSitesService, PrismaService, PlanGuard],
})
export class ClinicSitesModule {}
