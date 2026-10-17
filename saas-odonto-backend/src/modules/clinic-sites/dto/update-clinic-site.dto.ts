import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicSiteDto {
  @ApiProperty({ example: 'Clínica Sorriso Perfeito', description: 'The public title of the landing page' })
  title?: string;

  @ApiProperty({ example: 'Professional dental care for your family.', description: 'The main subtitle or description' })
  description?: string;

  @ApiProperty({ example: 'https://images.com', description: 'URL of the clinic logo image' })
  logo?: string;

  @ApiProperty({ example: '11999999999', description: 'Public contact phone' })
  phone?: string;

  @ApiProperty({ example: '11999999999', description: 'WhatsApp click-to-chat number' })
  whatsapp?: string;

  @ApiProperty({ example: '#0F172A', description: 'Primary brand color (Hexadecimal)' })
  primaryColor?: string;

  @ApiProperty({ example: '#10B981', description: 'Accent color for buttons and highlights' })
  accentColor?: string;

  @ApiProperty({ example: '#F8FAFC', description: 'Main background layout color' })
  backgroundColor?: string;

  @ApiProperty({ example: 'light', description: 'Base theme configuration (light / dark)' })
  theme?: string;
}
