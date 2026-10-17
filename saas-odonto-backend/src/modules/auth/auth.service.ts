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
}
