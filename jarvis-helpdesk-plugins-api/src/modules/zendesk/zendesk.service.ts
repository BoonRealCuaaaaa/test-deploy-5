import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAssistantService } from 'src/shared/modules/ai-assistant/ai-assistant.service';
import { HttpRequestContextService } from 'src/shared/modules/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

import { AssistantService } from '../assistant/assistant.service';
import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';
import { TeamRoleEnum } from '../team/constants/team-role.enum';
import { TeamService } from '../team/team.service';

import { calculateAverageResponseTimeFromAgent, calculateLastMessageTime } from './lib/helpers/ticket-sidebar.helper';
import { formatConversation } from './lib/utils';
import { Conversation, Requester, Ticket, Via } from './types/zendesk.type';
@Injectable()
export class ZendeskService {
  constructor(
    private aiAssistantService: AiAssistantService,
    @InjectRepository(IntegrationPlatform)
    private integrationPlatformRepository: Repository<IntegrationPlatform>,
    private httpContext: HttpRequestContextService,
    private assistantService: AssistantService,
    private teamService: TeamService
  ) {}

  async generateDraftResponse(
    conversation: Conversation[],
    requester: Requester,
    via: Via,
    domain: string
  ): Promise<string> {
    const normalizedConversation = formatConversation(conversation);
    const chatThread = via.channel === 'native_messaging';

    return await this.aiAssistantService.generateDraftResponse(normalizedConversation, chatThread, domain, requester);
  }

  async generateFormalizeResponse(ticket: Ticket, givenText: string, variant: string, domain: string) {
    const normalizedConversation = formatConversation(ticket.conversation);

    return await this.aiAssistantService.generateFormalizeResponse(
      normalizedConversation,
      givenText,
      variant,
      domain,
      ticket.requester ? { name: ticket.requester.name } : undefined
    );
  }

  async generateAnalyzeTicket(ticket: Ticket, domain: string) {
    const normalizedConversation = formatConversation(ticket.conversation);
    const averageResponseTime = calculateAverageResponseTimeFromAgent(ticket.conversation);
    const lastMessageTime = calculateLastMessageTime(ticket.conversation);

    return await this.aiAssistantService.generateAnalyzeTicket(
      normalizedConversation,
      domain,
      averageResponseTime,
      lastMessageTime
    );
  }

  async findDomain(domain: string) {
    const platform = await this.integrationPlatformRepository.findOne({ where: { domain }, relations: ['team'] });

    if (!platform) {
      throw new NotFoundException('Domain not found');
    }

    const userId = this.httpContext.getUserId();

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const teams = await this.teamService.getTeams(userId);
    const userIsInTeam = teams.some((team) => team.team.id === platform.team.id);

    if (!userIsInTeam) {
      await this.teamService.addUserToTeam(userId, platform.team.id, TeamRoleEnum.MEMBER);
      await this.assistantService.createAssistantConfig(platform.team.activateAssistantId, userId);
    }

    return platform;
  }
}
