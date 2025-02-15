import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';
import { Team } from '../team/entities/team.entity';

import { IntegrationPlatform } from './entities/integration-platform.entity';
import { IntegrationPlatformController } from './integration-platform.controller';
import { IntegrationPlatformService } from './integration-platform.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationPlatform, TeamGettingStartedTask, Team]), AuthModule],
  controllers: [IntegrationPlatformController],
  providers: [IntegrationPlatformService],
  exports: [IntegrationPlatformService],
})
export class IntegrationPlatformModule {}
