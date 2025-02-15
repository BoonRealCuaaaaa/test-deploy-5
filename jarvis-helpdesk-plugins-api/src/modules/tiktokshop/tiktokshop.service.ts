import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAssistantService } from 'src/shared/modules/ai-assistant/ai-assistant.service';
import { Repository } from 'typeorm';

import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';

import { calculateAverageResponseTime, calculateLastMessageTime } from './libs/helpers/ticket-sidebar.helper';
import { formatConversation } from './libs/utils';
import { ChatMessage } from './types/tiktokshop.type';

@Injectable()
export class TiktokshopService {
  constructor(
    private aiAssistantService: AiAssistantService,
    @InjectRepository(IntegrationPlatform) private integrationPlatformRepository: Repository<IntegrationPlatform>
  ) {}

  async generateDraftResponse(conversation: ChatMessage[], domain: string): Promise<string> {
    const normalizedConversation = formatConversation(conversation);
    return this.aiAssistantService.generateDraftResponse(normalizedConversation, true, domain, undefined);
  }

  async generateFormalizeResponse(conversation: ChatMessage[], givenText: string, variant: string, domain: string) {
    const normalizedConversation = formatConversation(conversation);

    return await this.aiAssistantService.generateFormalizeResponse(
      normalizedConversation,
      givenText,
      variant,
      domain,
      undefined
    );
  }

  async generateAnalyzeTicket(conversation: ChatMessage[], domain: string) {
    const normalizedConversation = formatConversation(conversation);
    const averageResponseTime = calculateAverageResponseTime(conversation).toString();
    const lastMessageTime = calculateLastMessageTime(conversation) ?? '';

    return await this.aiAssistantService.generateAnalyzeTicket(
      normalizedConversation,
      domain,
      averageResponseTime,
      lastMessageTime
    );
  }

  async findDomain(domain: string) {
    const integrationPlatform = await this.integrationPlatformRepository.findOne({
      where: { domain },
    });

    if (!integrationPlatform) {
      throw new NotFoundException('Domain not found');
    }

    return integrationPlatform;
  }
}
