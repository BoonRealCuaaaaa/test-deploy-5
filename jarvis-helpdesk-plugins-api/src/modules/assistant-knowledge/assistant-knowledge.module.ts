import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantModule } from 'src/shared/modules/ai-assistant/ai-assistant.module';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { AuthModule } from '../auth/auth.module';

import { AssistantKnowledgeController } from './assistant-knowledge.controller';
import { AssistantKnowledgeService } from './assistant-knowledge.service';

@Module({
  controllers: [AssistantKnowledgeController],
  providers: [AssistantKnowledgeService],
  imports: [AiAssistantModule, TypeOrmModule.forFeature([AIAssistant]), AuthModule],
  exports: [AssistantKnowledgeService],
})
export class AssistantKnowledgeModule {}
