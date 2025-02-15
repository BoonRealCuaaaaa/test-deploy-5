import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthStrategy } from 'src/modules/auth/constants/strategies.enum';

@Injectable()
export class AuthGuard extends NestAuthGuard(AuthStrategy.JWT_STACK_AUTH_ACCESS_TOKEN) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
