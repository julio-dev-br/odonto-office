import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: '1', description: 'The unique ID of the target patient' })
  patientId: string;

  @ApiProperty({ example: '1', description: 'The unique ID of the professional/dentist' })
  professionalId: string;

  @ApiProperty({ example: '2026-10-20T14:30:00.000Z', description: 'Appointment start timestamp (ISO format)' })
  startAt: string;

  @ApiProperty({ example: '2026-10-20T15:30:00.000Z', description: 'Appointment end timestamp (ISO format)' })
  endAt: string;

  @ApiProperty({ example: 'Profilaxia (Limpeza)', description: 'Type or short title of the dental procedure' })
  type: string;

  @ApiProperty({ example: 'Paciente prefere atendimento sem anestesia', required: false, description: 'Clinical or general reception notes' })
  notes?: string;
}
