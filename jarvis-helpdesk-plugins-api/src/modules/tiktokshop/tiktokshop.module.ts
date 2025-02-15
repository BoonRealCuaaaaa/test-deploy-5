import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantModule } from 'src/shared/modules/ai-assistant/ai-assistant.module';
import { HttpRequestContextModule } from 'src/shared/modules/http-request-context/http-request-context.module';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { UserAssistantConfig } from '../assistant/entities/user-assistant-config.entity';
import { AuthModule } from '../auth/auth.module';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';

import { TiktokshopController } from './tiktokshop.controller';
import { TiktokshopService } from './tiktokshop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntegrationPlatform, UserAssistantConfig, AIAssistant]),
    AiAssistantModule,
    HttpRequestContextModule,
    AuthModule,
  ],
  controllers: [TiktokshopController],
  providers: [TiktokshopService],
  exports: [TiktokshopService],
})
export class TiktokshopModule {}
