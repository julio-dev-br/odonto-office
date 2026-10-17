import { Module } from '@nestjs/common';
import { FinancialTransactionsService } from './financial-transactions.service';
import { FinancialTransactionsController } from './financial-transactions.controller';
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [FinancialTransactionsController],
  providers: [FinancialTransactionsService, PrismaService],
})
export class FinancialTransactionsModule {}
