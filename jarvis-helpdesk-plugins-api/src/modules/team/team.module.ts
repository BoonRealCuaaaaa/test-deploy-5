import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantModule } from 'src/shared/modules/ai-assistant/ai-assistant.module';
import { StackAuthModule } from 'src/shared/modules/stack-auth/stack-auth.module';

import { AssistantModule } from '../assistant/assistant.module';
import { AIAssistant } from '../assistant/entities/assistant.entity';
import { AuthModule } from '../auth/auth.module';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';
import { GettingStartedTaskModule } from '../getting-started/getting-started-task.module';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';
import { User } from '../user/entities/user.entity';

import { Team } from './entities/team.entity';
import { TeamRole } from './entities/team-role.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, AIAssistant, TeamRole, IntegrationPlatform, TeamGettingStartedTask, User]),
    StackAuthModule,
    forwardRef(() => AssistantModule),
    forwardRef(() => AiAssistantModule),
    forwardRef(() => AuthModule),
    forwardRef(() => GettingStartedTaskModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
