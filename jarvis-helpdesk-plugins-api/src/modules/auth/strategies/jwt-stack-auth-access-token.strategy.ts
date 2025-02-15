import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-http-header-strategy';
import { getDefaultTeamName } from 'src/modules/team/helpers/default-name.helper';
import { TeamService } from 'src/modules/team/team.service';
import { User } from 'src/modules/user/entities/user.entity';
import { HeaderKey } from 'src/shared/constants/http-request';
import { CurrentUserDto } from 'src/shared/dtos/current-user.dto';
import { HttpRequestContextService } from 'src/shared/modules/http-request-context/http-request-context.service';
import { JwksService } from 'src/shared/modules/jwks/jwks.service';
import { StackAuthService } from 'src/shared/modules/stack-auth/stack-auth.service';
import { Repository } from 'typeorm';

import { AuthStrategy } from '../constants/strategies.enum';

@Injectable()
export class JwtStackAuthAccessTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.JWT_STACK_AUTH_ACCESS_TOKEN
) {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly jwksService: JwksService,
    private readonly teamService: TeamService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly httpContext: HttpRequestContextService,
    private readonly stackAuthService: StackAuthService
  ) {
    super({
      header: HeaderKey.AUTHORIZATION,
    });
  }

  async validate(token: string) {
    const payload = await this.jwksService.verifyJwksToken(token);

    let user = await this.userRepository.findOneBy({
      stackId: payload.sub,
    });
    let wouldCreateDefaultTeam = false;
    let defaultTeamUserName: string | null = null;

    if (!user) {
      const stackAuthUser = await this.stackAuthService.getMe(token);
      user = this.userRepository.create({
        stackId: stackAuthUser.id,
        email: stackAuthUser.primary_email,
      });
      user = await this.userRepository.save(user);

      wouldCreateDefaultTeam = true;
      defaultTeamUserName = stackAuthUser.display_name;
    }

    if (!user.email) {
      const stackAuthUser = await this.stackAuthService.getMe(token);
      user.email = stackAuthUser.primary_email;
      user = await this.userRepository.save(user);
    }

    const curUser: CurrentUserDto = {
      id: user.id,
      email: '',
      username: '',
      roles: [],
      stackAuthAccessToken: token,
      stackId: user.stackId,
    };

    this.httpContext.setUser(curUser);

    if (wouldCreateDefaultTeam) {
      const teamName = getDefaultTeamName(defaultTeamUserName);
      await this.teamService.create(user.stackId, user.id, {
        displayName: teamName,
      });
    }

    return curUser;
  }
}
