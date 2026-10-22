import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const userModel = client.user || client.User;
    const professionalModel = client.professional || client.Professional; 

    const existing = await userModel.findFirst({
      where: { email: body.email },
    });

    if (existing) {
      throw new BadRequestException('Este e-mail já está sendo utilizado por outro colaborador.');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await userModel.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'RECEPTIONIST',
        active: true,
      },
    });

    if (body.role === 'DENTIST') {
      await professionalModel.create({
        data: {
          userId: newUser.id, 
          name: newUser.name,
          cro: body.cro || 'CRO-SP Aguardando',
          specialty: body.specialty || 'Clínico Geral',
          active: true 
        }
      });
    }

    return newUser;
  }

  async findAll() {
    const client = this.prisma.tenantClient as any;
    const model = client.user || client.User;
    return model.findMany({
      orderBy: { name: 'asc' }
    });
  }

}
