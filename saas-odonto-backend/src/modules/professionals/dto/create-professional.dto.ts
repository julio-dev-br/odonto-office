import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalDto {
  @ApiProperty({ example: 'Dr. Anderson Silva', description: 'Full name of the dental professional' })
  name: string;

  @ApiProperty({ example: 'CRO-SP 12345', description: 'Official dental regional board registration code' })
  cro: string;

  @ApiProperty({ example: 'Ortodontia', description: 'The main expert specialty of the professional' })
  specialty: string;

  @ApiProperty({ example: '2', required: false, description: 'Optional: Linked system User ID for platform credentials login' })
  userId?: string;
}
