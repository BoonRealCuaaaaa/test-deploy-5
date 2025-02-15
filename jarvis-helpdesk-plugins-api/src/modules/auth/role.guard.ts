import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/shared/constants/roles';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const teamId = request.headers['team-id'];
    const userId = (request.user as { [K: string]: string }).id.toString();

    if (!teamId) {
      return false;
    }

    const userRoles = await this.authService.getTeamRoles(userId, teamId as string);

    if (userRoles.length === 0) {
      return false;
    }

    return userRoles.every((role) => requiredRoles.includes(role as unknown as UserRole));
  }
}
