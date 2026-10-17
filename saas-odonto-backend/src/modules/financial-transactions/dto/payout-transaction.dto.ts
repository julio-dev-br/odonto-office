import { ApiProperty } from '@nestjs/swagger';

export class PayoutTransactionDto {
  @ApiProperty({ example: 'pix', description: 'The method of payment capture (pix, credit_card, debit_card, cash)' })
  paymentMethod: string;

  @ApiProperty({ example: '2026-10-17T09:00:00.000Z', required: false, description: 'Optional date of payment. Defaults to current server timestamp.' })
  paymentDate?: string;
}
