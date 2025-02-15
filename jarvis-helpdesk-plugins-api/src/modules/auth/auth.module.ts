import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/modules/auth/role.guard';
import { JwksModule } from 'src/shared/modules/jwks/jwks.module';
import { StackAuthModule } from 'src/shared/modules/stack-auth/stack-auth.module';

import { TeamRole } from '../team/entities/team-role.entity';
import { TeamModule } from '../team/team.module';
import { User } from '../user/entities/user.entity';

import { JwtStackAuthAccessTokenStrategy } from './strategies/jwt-stack-auth-access-token.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeamRole]), JwksModule, StackAuthModule, forwardRef(() => TeamModule)],
  providers: [JwtStackAuthAccessTokenStrategy, RolesGuard, AuthService],
  exports: [RolesGuard, AuthService],
})
export class AuthModule {}
