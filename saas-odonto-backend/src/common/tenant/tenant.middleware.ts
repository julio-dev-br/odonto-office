import { Injectable, NestMiddleware, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { tenantStorage } from './tenant.storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let tenantId: string | undefined = undefined;

    // 1. EXTRAÇÃO DO TOKEN JWT
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const segredo = process.env.JWT_SECRET || 'SECRET_KEY_SUPER_SECRETA_SAAS_2026';
        const decoded = jwt.verify(token, segredo) as any;
        
        tenantId = decoded.tenantId;
      } catch (error) {
        throw new UnauthorizedException('Sua sessão expirou ou o Token enviado é inválido.');
      }
    }

    // 2. FALLBACK PARA O CABEÇALHO MANUAL (Para rotas sem login, se aplicável)
    if (!tenantId) {
      tenantId = req.headers['x-tenant-id'] as string;
    }

    // 3. SE CAIR AQUI SEM ID, SIGNIFICA QUE É UMA ROTA PRIVADA QUE FOI ACESSADA SEM IDENTIFICAÇÃO!
    if (!tenantId) {
      throw new BadRequestException('Identificador da clínica (Token ou Header X-Tenant-ID) não localizado.');
    }

    // 4. Envelopa no cofre AsyncLocalStorage para isolamento automático do Prisma
    tenantStorage.run(tenantId, () => next());
  }
}
