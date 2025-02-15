import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { HttpRequestContextService } from '../http-request-context/http-request-context.service';

import { KbAssistantService } from './services/kb-assistant.service';
import { KbKnowledgeService } from './services/kb-knowledge.service';
import { KbThreadService } from './services/kb-thread.service';
import { KbCoreClientService } from './kb-core-client.service';

@Global()
@Module({
  providers: [
    KbCoreClientService,
    KbKnowledgeService,
    KbAssistantService,
    KbThreadService,
    {
      provide: 'KB_CORE_CLIENT',
      useFactory: (configService: ConfigService, httpContextService: HttpRequestContextService) => {
        const instance = axios.create({
          baseURL: configService.get('knowledgeBase.endpoint'),
        });

        instance.interceptors.request.use((config) => {
          const accessToken = httpContextService.getAccessToken();
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        });

        return instance;
      },
      inject: [ConfigService, HttpRequestContextService],
    },
  ],
  exports: [KbCoreClientService],
})
export class KbCoreClientModule {}
