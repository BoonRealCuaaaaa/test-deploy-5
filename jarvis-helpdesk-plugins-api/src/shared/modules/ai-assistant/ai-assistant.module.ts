import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { UserAssistantConfig } from 'src/modules/assistant/entities/user-assistant-config.entity';
import { IntegrationPlatform } from 'src/modules/integration-platform/entities/integration-platform.entity';
import { IntegrationPlatformModule } from 'src/modules/integration-platform/integration-platform.module';
import { ResponseTemplate } from 'src/modules/response-template/entities/response-template.entity';
import { Rule } from 'src/modules/rule/entities/rule.entity';

import { HttpRequestContextModule } from '../http-request-context/http-request-context.module';

import { AiAssistantService } from './ai-assistant.service';

@Module({
  imports: [
    IntegrationPlatformModule,
    HttpRequestContextModule,
    TypeOrmModule.forFeature([AIAssistant, ResponseTemplate, Rule, IntegrationPlatform, UserAssistantConfig]),
  ],
  providers: [AiAssistantService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
