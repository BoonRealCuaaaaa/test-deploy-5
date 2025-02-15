import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { AuthModule } from '../auth/auth.module';

import { ResponseTemplate } from './entities/response-template.entity';
import { ResponseTemplateController } from './response-template.controller';
import { ResponseTemplateService } from './response-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseTemplate, AIAssistant]), AuthModule],
  controllers: [ResponseTemplateController],
  providers: [ResponseTemplateService],
})
export class ResponseTemplateModule {}
