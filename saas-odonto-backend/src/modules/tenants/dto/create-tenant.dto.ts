import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Clínica Sorriso Perfeito', description: 'The official commercial name of the clinic' })
  name: string;

  @ApiProperty({ example: 'sorriso-perfeito', description: 'The unique slug used for the custom subdomains/routes' })
  slug: string;

  @ApiProperty({ example: 'Dr. Anderson Silva', description: 'Full name of the clinic owner/admin' })
  adminName: string;

  @ApiProperty({ example: 'anderson@sorrisoperfeito.com', description: 'The main administrator email for login' })
  adminEmail: string;

  @ApiProperty({ example: 'senhaMestre123', description: 'The secure password for the first admin user' })
  adminPassword: string;
}
