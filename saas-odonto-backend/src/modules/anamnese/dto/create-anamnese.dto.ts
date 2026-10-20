import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnamneseDto {
  @ApiProperty({ example: '1', description: 'The unique ID of the target patient' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: true, description: 'Indicates if the patient has any systemic allergies' })
  @IsBoolean()
  hasAllergy: boolean;

  @ApiProperty({ example: 'Alergia severa a Penicilina e Dipirona', required: false, description: 'Detailed description of patient allergies' })
  @IsOptional()
  @IsString()
  allergyDetails?: string;

  @ApiProperty({ example: false, description: 'Indicates if the patient has any cardiovascular heart disease' })
  @IsBoolean()
  hasHeartDisease: boolean;

  @ApiProperty({ example: true, description: 'Indicates if the patient is hypertensive (high blood pressure)' })
  @IsBoolean()
  isHypertensive: boolean;

  @ApiProperty({ example: 'Uso diário de Losartana 50mg', required: false, description: 'Continuous medications currently used by the patient' })
  @IsOptional()
  @IsString()
  continuousMedication?: string;

  @ApiProperty({ example: false, description: 'History of hemorrhages or abnormal bleeding in previous extractions' })
  @IsBoolean()
  bleedingHistory: boolean;
}