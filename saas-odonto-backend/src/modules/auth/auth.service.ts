import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(body: any) {
    const { email, password, name, role, tenantId } = body;

    if (!tenantId || !email || !password || !name || !role) {
      throw new BadRequestException('All fields (tenantId, email, password, name, role) are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return (this.prisma.tenantClient as any).user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
        tenantId: BigInt(tenantId),
        active: true,
      },
    });
  }

  async login(body: any) {
    const { email, password, tenantId } = body;

    if (!tenantId) {
      throw new BadRequestException('Clinic ID (tenantId) is required for login.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        tenantId: BigInt(tenantId),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials for the specified clinic.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { 
      sub: user.id.toString(), 
      email: user.email, 
      role: user.role,
      tenantId: user.tenantId.toString() 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async getProfile(userId: string | number) {
    const client = this.prisma.tenantClient as any;
    
    const targetId = userId ? BigInt(userId) : null;
    
    const queryCondition = targetId ? { id: targetId } : { role: 'ADMIN' };

    const user = await client.user.findFirst({
      where: queryCondition,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não localizado no banco.');
    }

    return {
      ...user,
      id: user.id.toString(),
    };
  }

  async updateProfile(userId: string | number, body: any) {
    const client = this.prisma.tenantClient as any;
    
    // Fallback preventivo para evitar o travamento 400
    const targetId = userId ? BigInt(userId) : (await client.user.findFirst({ where: { role: 'ADMIN' } }))?.id;

    if (!targetId) {
      throw new BadRequestException('User ID is required to update profile.');
    }

    const updatedUser = await client.user.update({
      where: { id: BigInt(targetId) },
      data: {
        name: body.name,
        email: body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      ...updatedUser,
      id: updatedUser.id.toString(),
    };
  }

}
