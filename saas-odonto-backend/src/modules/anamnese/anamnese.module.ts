import { Module } from '@nestjs/common';
import { AnamneseController } from './anamnese.controller';
import { AnamneseService } from './anamnese.service';
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [AnamneseController],
  providers: [AnamneseService, PrismaService]
})
export class AnamneseModule {}
