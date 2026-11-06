import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Mariana Costa' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório.' })
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: '11999999999' })
  @IsString()
  @IsNotEmpty({ message: 'O WhatsApp é obrigatório.' })
  whatsapp: string;

  @ApiProperty({ example: '111.111.111-11', required: false })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({ example: '1', description: 'ID do profissional' })
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @ApiProperty({ example: '1', description: 'ID do procedimento' })
  @IsString()
  @IsNotEmpty()
  procedureId: string;

  @ApiProperty({ example: '2026-11-10', description: 'Data no formato YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida. Use o formato YYYY-MM-DD.' })
  date: string;

  @ApiProperty({ example: '09:00', description: 'Horário no formato HH:MM' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Horário inválido. Use o formato HH:MM.' })
  time: string;

  // 🛡️ Honeypot (Anti-Bot)
  @IsOptional()
  @IsString()
  website?: string;
}