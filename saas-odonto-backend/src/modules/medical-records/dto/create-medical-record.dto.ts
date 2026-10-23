import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: '3', description: 'ID do paciente (BigInt em string)' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: '1', description: 'ID do procedimento clínico (BigInt em string)' })
  @IsNotEmpty()
  @IsString()
  procedureId: string;

  @ApiProperty({ example: '3', description: 'ID do profissional/dentista logado (BigInt em string)' })
  @IsNotEmpty()
  @IsString()
  professionalId: string;

  @ApiProperty({ example: 'Paciente relata melhora...', description: 'Notas da evolução clínica' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
