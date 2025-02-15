import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpRequestContextModule } from 'src/shared/modules/http-request-context/http-request-context.module';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { UserAssistantConfig } from '../assistant/entities/user-assistant-config.entity';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, AIAssistant, UserAssistantConfig]), HttpRequestContextModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
