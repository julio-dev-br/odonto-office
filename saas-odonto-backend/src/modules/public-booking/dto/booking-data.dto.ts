import { ApiProperty } from '@nestjs/swagger';

export class BookingDataResponseDto {
  @ApiProperty()
  clinicName: string;

  @ApiProperty({ type: () => [ProfessionalDto] })
  professionals: any[];

  @ApiProperty({ type: () => [ProcedureDto] })
  procedures: any[];
}

class ProfessionalDto {
  id: string;
  name: string;
  specialty: string;
  bufferTime: number;
  procedures: string[]; // IDs dos procedimentos que ele faz
}

class ProcedureDto {
  id: string;
  name: string;
  price: number;
  estimatedMin: number;
}