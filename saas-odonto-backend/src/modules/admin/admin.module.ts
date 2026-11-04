import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service'; // 🚀 Importa o Service
import { PrismaService } from '../../core/database/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService], // 🚀 Adiciona ambos aqui
})
export class AdminModule {}