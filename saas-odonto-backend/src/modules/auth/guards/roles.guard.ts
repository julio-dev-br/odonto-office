import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'; 
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Puxa as roles permitidas que carimbamos na rota via decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota não tiver o decorator @Roles, ela é liberada por padrão
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token is required.');
    }

    try {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'SECRET_KEY_SUPER_SECRETA_SAAS_2026';
      
      const decoded = jwt.verify(token, secret) as any;
      const userRole = decoded.role; // Puxa 'ADMIN', 'DENTIST', 'RECEPTIONIST', etc.

      const hasPermission = requiredRoles.includes(userRole);

      if (!hasPermission) {
        throw new ForbiddenException('Access denied. Your profile does not have permission for this resource.');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('Invalid or expired authentication token.');
    }
  }
}
