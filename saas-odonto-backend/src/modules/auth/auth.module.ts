import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true, // Torna o módulo JWT visível por toda a aplicação
      secret: process.env.JWT_SECRET || 'SECRET_KEY_SUPER_SECRETA_SAAS_2026',
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
