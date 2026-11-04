import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Autenticação') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastra um novo usuário/profissional atrelado a uma clínica' })
  async registrar(@Body() body: any) {
    return this.authService.registrar(body);
  }

  @Post('tenant-register')
  @ApiOperation({ summary: 'Cadastra uma nova clínica (Tenant) e seu usuário Admin' })
  async cadastrarNovaClinica(@Body() body: RegisterDto) {
    return this.authService.cadastrarNovaClinica(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza a autenticação do usuário na clínica' })
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}