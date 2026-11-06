import { IsInt, IsString, IsOptional, Min, Max, Matches, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 1, description: '0=Domingo, 1=Segunda, 2=Terça... 6=Sábado' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00', description: 'Horário de início (HH:MM)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime deve estar no formato HH:MM' })
  startTime: string;

  @ApiProperty({ example: '18:00', description: 'Horário de término (HH:MM)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime deve estar no formato HH:MM' })
  endTime: string;

  @ApiProperty({ example: '12:00', description: 'Início do intervalo (Opcional)', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'breakStart deve estar no formato HH:MM' })
  breakStart?: string;

  @ApiProperty({ example: '13:00', description: 'Fim do intervalo (Opcional)', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'breakEnd deve estar no formato HH:MM' })
  breakEnd?: string;

  @ApiProperty({ example: true, description: 'Se o dia está ativo', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}