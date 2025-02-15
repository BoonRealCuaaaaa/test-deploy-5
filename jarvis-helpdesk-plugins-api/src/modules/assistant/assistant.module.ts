import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantModule } from 'src/shared/modules/ai-assistant/ai-assistant.module';

import { AuthModule } from '../auth/auth.module';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';
import { ResponseTemplate } from '../response-template/entities/response-template.entity';
import { Rule } from '../rule/entities/rule.entity';
import { User } from '../user/entities/user.entity';

import { AIAssistant } from './entities/assistant.entity';
import { AssistantConfig } from './entities/assistant-config.entity';
import { UserAssistantConfig } from './entities/user-assistant-config.entity';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AIAssistant,
      User,
      Rule,
      ResponseTemplate,
      UserAssistantConfig,
      AssistantConfig,
      IntegrationPlatform,
    ]),
    AiAssistantModule,
    AuthModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
