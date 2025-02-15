import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { AuthModule } from '../auth/auth.module';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';

import { Rule } from './entities/rule.entity';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule, AIAssistant, TeamGettingStartedTask]), AuthModule],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule {}
