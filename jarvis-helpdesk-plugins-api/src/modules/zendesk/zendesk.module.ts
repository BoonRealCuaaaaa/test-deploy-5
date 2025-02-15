import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantModule } from 'src/shared/modules/ai-assistant/ai-assistant.module';
import { HttpRequestContextModule } from 'src/shared/modules/http-request-context/http-request-context.module';

import { AssistantModule } from '../assistant/assistant.module';
import { UserAssistantConfig } from '../assistant/entities/user-assistant-config.entity';
import { AuthModule } from '../auth/auth.module';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';
import { IntegrationPlatformModule } from '../integration-platform/integration-platform.module';
import { ResponseTemplate } from '../response-template/entities/response-template.entity';
import { Rule } from '../rule/entities/rule.entity';
import { Team } from '../team/entities/team.entity';
import { TeamModule } from '../team/team.module';

import { ZendeskController } from './zendesk.controller';
import { ZendeskService } from './zendesk.service';

@Module({
  imports: [
    AiAssistantModule,
    AssistantModule,
    IntegrationPlatformModule,
    HttpRequestContextModule,
    AuthModule,
    TeamModule,
    TypeOrmModule.forFeature([Team, ResponseTemplate, Rule, IntegrationPlatform, UserAssistantConfig]),
  ],
  controllers: [ZendeskController],
  providers: [ZendeskService],
  exports: [ZendeskService],
})
export class ZendeskModule {}
