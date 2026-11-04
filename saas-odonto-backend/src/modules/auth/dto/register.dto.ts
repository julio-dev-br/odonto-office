import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Odonto Office Centro', description: 'Nome da nova clínica' })
  @IsNotEmpty({ message: 'O nome da clínica é obrigatório' })
  clinicName: string;

  @ApiProperty({ example: 'Dr. João Silva', description: 'Nome do administrador' })
  @IsNotEmpty({ message: 'O nome do usuário é obrigatório' })
  userName: string;

  @ApiProperty({ example: 'joao@odonto.com', description: 'E-mail de acesso' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha de acesso' })
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  // 🚀 NOVO CAMPO: Recebe o plano escolhido na Landing Page
  @ApiProperty({ example: 'pro', description: 'Plano escolhido pelo usuário (starter, pro, platinum)' })
  @IsString()
  @IsOptional()
  plan?: string;
}