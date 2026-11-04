import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(200, { message: 'O nome é muito longo.' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'Gostaria de saber mais sobre os planos.' })
  @IsString()
  @IsNotEmpty({ message: 'A mensagem é obrigatória.' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres.' })
  message: string;

  // 🛡️ HONEYPOT: Campo invisível no HTML. Se vier preenchido, é um robô.
  @IsEmpty({ message: 'Spam detectado.' })
  @IsOptional()
  website?: string;
}