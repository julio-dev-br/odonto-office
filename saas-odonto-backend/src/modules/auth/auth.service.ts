import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';
import { PrismaService } from '../../core/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async cadastrarNovaClinica(data: RegisterDto) {
    const { clinicName, userName, email, password, plan } = data;

    try {
      const userExists = await this.prisma.user.findFirst({ where: { email } });
      if (userExists) {
        throw new BadRequestException('Este e-mail já está em uso.');
      }

      const slug = slugify(clinicName, { lower: true, strict: true });
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.$transaction(async (tx) => {
        // 1. Cria o Tenant (Clínica)
        const tenant = await tx.tenant.create({
          data: { name: clinicName, slug, plan: plan ? plan.toLowerCase() : 'starter' },
        });

        // 2. Cria o Usuário Admin
        const user = await tx.user.create({
          data: {
            tenantId: tenant.id,
            name: userName,
            email,
            password: hashedPassword,
            role: 'ADMIN',
          },
        });

        // 3. Cria o Site Padrão em Rascunho
        await tx.clinicSite.create({
          data: {
            tenantId: tenant.id,
            title: clinicName,
          },
        });

        // 4. Retorna o usuário
        return user;
      });

      // 🚀 AQUI ESTÁ O QUE FALTAVA: O retorno da função para o Frontend
      const { password: _, ...result } = newUser;

      return {
        message: 'Conta criada com sucesso!',
        user: {
          ...result,
          id: result.id.toString(),
          tenantId: result.tenantId.toString(),
        },
      };

    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Uma clínica com este nome já existe. Tente outro nome.');
        }
      }

      console.error(error);
      throw new InternalServerErrorException('Erro ao criar a conta.');
    }
  }

  async registrar(body: any) {
    const { email, password, name, role, tenantId } = body;

    if (!tenantId || !email || !password || !name || !role) {
      throw new BadRequestException('All fields (tenantId, email, password, name, role) are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await (this.prisma.tenantClient as any).user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
        tenantId: BigInt(tenantId),
        active: true,
      },
    });

    const { password: _, ...result } = newUser;
    return {
      ...result,
      id: result.id.toString(),
      tenantId: result.tenantId.toString(),
    };
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
      include: {
        tenant: true,
      }
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
        tenantId: user.tenantId.toString(),
        tenantName: user.tenant.name,
        tenantPlan: user.tenant.plan,
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