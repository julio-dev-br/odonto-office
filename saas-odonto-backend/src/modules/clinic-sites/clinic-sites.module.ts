import { Module } from '@nestjs/common';
import { ClinicSitesService } from './clinic-sites.service';
import { ClinicSitesController } from './clinic-sites.controller';
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [ClinicSitesController],
  providers: [ClinicSitesService, PrismaService],
})
export class ClinicSitesModule {}
