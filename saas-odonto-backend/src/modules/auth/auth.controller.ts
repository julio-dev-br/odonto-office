import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('Autenticação') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastra um novo usuário/profissional atrelado a uma clínica' })
  async registrar(@Body() body: any) {
    return this.authService.registrar(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza a autenticação do usuário na clínica' })
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

 @Get('me')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado na sessão via /auth/me' })
  async getMe(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.authService.getProfile(userId);
  }


  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado na sessão via /auth/profile' })
  async getProfile(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.authService.getProfile(userId);
  }

 @Put('profile')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECEPTIONIST', 'DENTIST')
  @ApiOperation({ summary: 'Atualiza as informações pessoais do usuário logado' })
  async updateProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    return this.authService.updateProfile(userId, body);
  }
}
