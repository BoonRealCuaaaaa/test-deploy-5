import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { HeaderKey } from 'src/shared/constants/http-request';
import { NextFunction, Request, Response } from 'express';

import { HttpRequestContextService } from '../modules/http-request-context/http-request-context.service';

@Injectable()
export class AccessTokenStorageMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AccessTokenStorageMiddleware.name);

  constructor(private readonly httpContext: HttpRequestContextService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const authorizationHeader = req.headers[HeaderKey.AUTHORIZATION.toLocaleLowerCase()] as string;
    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    this.httpContext.setAccessToken(token);

    next();
  }
}
