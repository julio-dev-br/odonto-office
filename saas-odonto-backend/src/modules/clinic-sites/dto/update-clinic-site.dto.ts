import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsHexColor, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClinicSiteDto {
  @ApiProperty({ example: 'Clínica Sorriso Perfeito', description: 'The public title of the landing page' })
  @IsString({ message: 'O título deve ser um texto.' })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Professional dental care for your family.', description: 'The main subtitle or description' })
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://images.com', description: 'URL of the clinic logo image' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '11999999999', description: 'Public contact phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '11999999999', description: 'WhatsApp click-to-chat number' })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  // 🚀 IsHexColor garante que é uma cor hexadecimal válida (ex: #FFFFFF)
  @ApiProperty({ example: '#0F172A', description: 'Primary brand color (Hexadecimal)' })
  @IsHexColor({ message: 'A cor primária deve ser um código hexadecimal válido.' })
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ example: '#10B981', description: 'Accent color for buttons and highlights' })
  @IsHexColor({ message: 'A cor de destaque deve ser um código hexadecimal válido.' })
  @IsOptional()
  accentColor?: string;

  @ApiProperty({ example: '#F8FAFC', description: 'Main background layout color' })
  @IsHexColor({ message: 'A cor de fundo deve ser um código hexadecimal válido.' })
  @IsOptional()
  backgroundColor?: string;

  @ApiProperty({ example: 'light', description: 'Base theme configuration (light / dark)' })
  @Transform(({ value }) => value?.toLowerCase()) 
  @IsIn(['light', 'dark'], { message: 'O tema deve ser light ou dark.' })
  @IsOptional()
  theme?: string;
}