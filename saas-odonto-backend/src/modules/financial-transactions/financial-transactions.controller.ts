import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common'; // 👈 Adicionado Param e Put
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinancialTransactionsService } from './financial-transactions.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PayoutTransactionDto } from './dto/payout-transaction.dto';

@ApiTags('Financial (Financeiro)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('financial-transactions')
export class FinancialTransactionsController {
  constructor(private readonly financialTransactionsService: FinancialTransactionsService) { }

  @Get('balance')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Get current cash flow summary (Total Income, Expense and Net Balance)' })
  async getBalance() {
    return this.financialTransactionsService.getBalance();
  }

  @Post()
  @Roles('ADMIN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Create a new financial transaction (Income or Expense)' })
  async create(@Body() body: any) {
    return this.financialTransactionsService.create(body);
  }

  @Get()
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retrieve all financial transactions filtered by clinic' })
  async findAll() {
    return this.financialTransactionsService.findAll();
  }


  @Put(':id/pay')
  @Roles('ADMIN', 'RECEPTIONIST')
  @ApiOperation({ summary: 'Process payment payout for a pending transaction' })
  async payout(@Param('id') id: string, @Body() body: PayoutTransactionDto) {
    return this.financialTransactionsService.payout(id, body);
  }

  @Get('chart')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retorna o faturamento e despesas agrupados por mês para o gráfico' })
  async getChartData() {
    return this.financialTransactionsService.getChartData();
  }

  @Get('search/patients')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retrieve all patients filtered by clinic for dropdown search' })
  async searchPatients() {
    return this.financialTransactionsService.searchPatients();
  }

  @Get('search/procedures')
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retrieve all dental procedures filtered by clinic for dropdown search' })
  async searchProcedures() {
    return this.financialTransactionsService.searchProcedures();
  }

}
