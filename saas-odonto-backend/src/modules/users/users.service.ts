import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service'; 
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any) {
    const client = this.prisma.tenantClient as any;
    const model = client.user || client.User;

    const existing = await model.findFirst({
      where: { email: body.email },
    });

    if (existing) {
      throw new BadRequestException('Este e-mail já está sendo utilizado por outro colaborador.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    return model.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword, 
        role: body.role || 'RECEPTIONIST',
        active: true,
      },
    });
  }
}
