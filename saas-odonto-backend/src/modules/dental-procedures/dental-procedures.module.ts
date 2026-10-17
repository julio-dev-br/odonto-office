import { Module } from '@nestjs/common';
import { DentalProceduresService } from './dental-procedures.service';
import { DentalProceduresController } from './dental-procedures.controller';
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [DentalProceduresController],
  providers: [DentalProceduresService, PrismaService],
})
export class DentalProceduresModule {}
