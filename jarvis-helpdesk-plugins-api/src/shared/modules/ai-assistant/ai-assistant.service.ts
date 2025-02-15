import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AIAssistant } from 'src/modules/assistant/entities/assistant.entity';
import { UserAssistantConfig } from 'src/modules/assistant/entities/user-assistant-config.entity';
import { IntegrationPlatform } from 'src/modules/integration-platform/entities/integration-platform.entity';
import { QueryParamsDto } from 'src/shared/dtos/common.dto';
import { Repository } from 'typeorm';

import { HttpRequestContextService } from '../http-request-context/http-request-context.service';

import {
  DRAFT_RESPONSE_QUESTIONS_BASED_ON_TOPIC,
  DraftResponseDefaultRules,
  Topic,
} from './constants/draft-response.constant';
import { TicketAnalyzeTags } from './constants/ticket-analyze.constant';
import {
  buildDraftResponsePrompt,
  buildFindUnansweredQuestionsPrompt,
  buildFindUserInquiryAndClassifyPrompt,
  buildFormalizePrompt,
  buildTranslatePrompt,
} from './libs/helpers/response-toolbox.helper';
import { buildTicketAnalysisPrompt } from './libs/helpers/ticket-sidebar.helpder';
import { extractTagValues, markdownToHtml } from './libs/utils';
import { KbKnowledge } from './types/kb-knowledge';

@Injectable()
export class AiAssistantService {
  private client: AxiosInstance;
  constructor(
    private configService: ConfigService,
    private httpContext: HttpRequestContextService,
    @InjectRepository(IntegrationPlatform)
    private integrationPlatformRepository: Repository<IntegrationPlatform>,
    @InjectRepository(AIAssistant)
    private assistantRepository: Repository<AIAssistant>,
    @InjectRepository(UserAssistantConfig)
    private userAssistantConfigRepository: Repository<UserAssistantConfig>
  ) {
    this.client = axios.create({
      baseURL: configService.get('aiModuleApiUrl'),
    });

    this.client.interceptors.request.use((config) => {
      const accessToken = httpContext.getUserStackAuthAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
  }

  async askAssistant(message: string, kbAssistantId: string) {
    const authorizationHeader = this.httpContext.getRequestHeader('authorization') as string;
    const response = await this.client.post<any, AxiosResponse<string>>(
      `/api/v1/ai-assistant/generate-response`,
      {
        message,
        kbAssistantId,
      },
      {
        headers: {
          Authorization: authorizationHeader,
        },
      }
    );
    return response.data;
  }

  async createKnowledge(assistantId: string, { name, description }: { name?: string; description?: string }) {
    const assistant = await this.assistantRepository.findOne({ where: { id: assistantId } });

    if (!assistant) {
      throw new NotFoundException('Assistant is not found');
    }

    const response = await this.client.post<KbKnowledge>('/api/v1/ai-knowledge', {
      name,
      description,
    });

    await this.client.post('/api/v1/ai-assistant/knowledge', {
      knowledgeId: response.data.id,
      kbAssistantId: assistant.jarvisBotId,
    });

    return response.data;
  }

  async createAssistant(assistantName: string, instruction?: string, description?: string) {
    const response = await this.client.post('/api/v1/ai-assistant', {
      assistantName,
      instruction,
      description,
    });

    return response.data as { id: string; assistantName: string };
  }

  async getKnowledges({ query, offset, limit, order }: QueryParamsDto) {
    const searchParams = new URLSearchParams();
    searchParams.append('offset', offset?.toString() || '0');
    searchParams.append('limit', limit?.toString() || '5');

    if (query) {
      searchParams.append('q', query);
    }

    if (order?.field) {
      searchParams.append('order_field', `${order.field}`);
    }

    if (order?.direction) {
      searchParams.append('order', `${order.direction.toUpperCase()}`);
    } else {
      searchParams.append('order', 'DESC');
    }

    const response = await this.client.get(`/api/v1/ai-knowledge?${searchParams.toString()}`);
    return response.data;
  }

  async getAssistantKnowledges(assistantId: string, { query, offset, limit, order }: QueryParamsDto) {
    const assistant = await this.assistantRepository.findOne({ where: { id: assistantId } });

    if (!assistant) {
      throw new NotFoundException('Assistant is not found');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('offset', offset?.toString() || '0');
    searchParams.append('limit', limit?.toString() || '5');

    if (query) {
      searchParams.append('q', query);
    }

    if (order?.field) {
      searchParams.append('order_field', `${order.field}`);
    }

    if (order?.direction) {
      searchParams.append('order', `${order.direction.toUpperCase()}`);
    } else {
      searchParams.append('order', 'DESC');
    }

    const response = await this.client.get(
      `/api/v1/ai-assistant/${assistant.jarvisBotId}/knowledges?${searchParams.toString()}`
    );

    return response.data;
  }

  async getAssistantKnowledge(knowledgeId: string) {
    const response = await this.client.get(`/api/v1/ai-knowledge/${knowledgeId}`);
    return response.data;
  }

  async updateAssistantKnowledge(knowledgeId: string, { name, description }: { name: string; description?: string }) {
    const response = await this.client.patch<any, AxiosResponse<boolean>>(`/api/v1/ai-knowledge/${knowledgeId}`, {
      name,
      description,
    });

    return response.data;
  }

  async deleteKnowledge(knowledgeId: string) {
    await this.client.delete(`/api/v1/ai-knowledge/${knowledgeId}`);
  }

  async importLocalFIle(knowledgeId: string, file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);

    const response = await this.client.post<any, AxiosResponse<boolean>>(
      `/api/v1/ai-knowledge/${knowledgeId}/local-file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async importWeb(knowledgeId: string, name: string, webUrl: string) {
    const response = await this.client.post<any, AxiosResponse<boolean>>(`/api/v1/ai-knowledge/${knowledgeId}/web`, {
      name,
      webUrl,
    });

    return response.data;
  }

  async importKnowledgeToAssistant(kbAssistantId: string, knowledgeId: string) {
    const response = await this.client.post<any, AxiosResponse<any>>(`/api/v1/ai-assistant/knowledge`, {
      kbAssistantId,
      knowledgeId,
    });

    return response.data;
  }

  async getSources(knowledgeId: string, { query, offset, limit, order }: QueryParamsDto) {
    const searchParams = new URLSearchParams();
    searchParams.append('offset', offset?.toString() || '0');
    searchParams.append('limit', limit?.toString() || '5');

    if (query) {
      searchParams.append('q', query);
    }

    if (order?.field) {
      searchParams.append('order_field', `${order.field}`);
    }

    if (order?.direction) {
      searchParams.append('order', `${order.direction.toUpperCase()}`);
    } else {
      searchParams.append('order', 'DESC');
    }

    const response = await this.client.get(`/api/v1/ai-knowledge/${knowledgeId}/units?${searchParams.toString()}`);
    return response.data;
  }

  async updateSourceStatus(knowledgeId: string, sourceId: string, status: boolean) {
    await this.client.patch(`/api/v1/ai-knowledge/${knowledgeId}/units/${sourceId}`, { status });
  }

  async deleteSource(knowledgeId: string, sourceId: string) {
    await this.client.delete(`/api/v1/ai-knowledge/${knowledgeId}/units/${sourceId}`);
  }

  async generateDraftResponse(
    normalizedConversation: string[],
    isChatThread = false,
    domain: string,
    requester?: { name: string }
  ) {
    const userId = this.httpContext.getUserId();
    let template;

    const integrationPlatform = await this.integrationPlatformRepository.findOne({
      where: { domain },
      relations: [
        'team',
        'team.activateAssistant',
        'team.activateAssistant.responseTemplates',
        'team.activateAssistant.rules',
      ],
    });

    const assistant = await this.assistantRepository.findOne({
      where: { id: integrationPlatform?.team.activateAssistantId },
    });

    if (!assistant) {
      throw new HttpException('Assistant not found', HttpStatus.NOT_FOUND);
    }

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { user: { id: userId }, aiAssistant: { id: assistant.id } },
      relations: ['assistantConfig'],
    });

    const { toneOfAI, includeReference, language, enableTemplate } = userAssistantConfig?.assistantConfig.values || {
      toneOfAI: '',
      language: '',
      includeReference: true,
      enableTemplate: true,
    };

    const { responseTemplates } = assistant;

    if (enableTemplate) {
      template =
        responseTemplates.length > 0
          ? assistant.responseTemplates.find((template) => template.isActive)?.template ||
            `Hello ${requester?.name},\n\nThank you for reaching out to us.{YOUR CONTENT GO HERE}.\n\nBest regards`
          : `Hello ${requester?.name},\n\nThank you for reaching out to us.{YOUR CONTENT GO HERE}.\n\nBest regards`;
    }

    let rules = assistant.rules.map((r) => r.content);

    if (!rules.length) {
      rules = Object.values(DraftResponseDefaultRules);
    }

    const findUserInquiryAndClassifyPrompt = buildFindUserInquiryAndClassifyPrompt(normalizedConversation);

    const findUserInquiryAndClassifyPromptAnswer = await this.askAssistant(
      findUserInquiryAndClassifyPrompt,
      assistant.jarvisBotId
    );

    const wasGreetingTheCustomer = extractTagValues(
      findUserInquiryAndClassifyPromptAnswer,
      'wasGreetingTheCustomer'
    )[0];

    const summaryCustomerInquiry = extractTagValues(
      findUserInquiryAndClassifyPromptAnswer,
      'summaryCustomerInquiry'
    )[0];

    const issueCategory = extractTagValues(findUserInquiryAndClassifyPromptAnswer, 'issueCategory')[0];
    const isContinueWithAgent = extractTagValues(findUserInquiryAndClassifyPromptAnswer, 'isContinueWithAgent')[0];

    if (issueCategory === 'Other' || isContinueWithAgent === 'YES') {
      const translatePrompt = buildTranslatePrompt(
        `I'm sorry, but I'm not able to handle this question or topic. If you have other questions or need assistance with something else, feel free to ask me!`,
        language
      );

      const translateAnswer = await this.askAssistant(translatePrompt, assistant.jarvisBotId);
      const match = translateAnswer.match(/<final_answer>([\s\S]*?)<\/final_answer>/i);

      if (!match) {
        throw new HttpException('Internal server error', HttpStatus.BAD_REQUEST);
      }

      const finalAnswer = match[1].trim();
      return markdownToHtml(finalAnswer);
    }

    const questionsBasedOnTopic = DRAFT_RESPONSE_QUESTIONS_BASED_ON_TOPIC[issueCategory as Topic];
    let unansweredQuestions = '';

    if (questionsBasedOnTopic) {
      const findUnansweredQuestionsPrompt = buildFindUnansweredQuestionsPrompt(
        normalizedConversation,
        questionsBasedOnTopic
      );
      const findUnansweredQuestionsAnswer = await this.askAssistant(
        findUnansweredQuestionsPrompt,
        assistant.jarvisBotId
      );
      const findUnansweredQuestionsResult = extractTagValues(findUnansweredQuestionsAnswer, 'unansweredQuestions');
      unansweredQuestions = findUnansweredQuestionsResult[0];
    }

    const draftResponsePrompt = buildDraftResponsePrompt(
      summaryCustomerInquiry,
      unansweredQuestions,
      toneOfAI,
      rules,
      language,
      isChatThread,
      template,
      includeReference,
      wasGreetingTheCustomer === 'YES',
      requester === undefined ? 'Customer' : requester.name
    );

    const draftResponseAnswer = await this.askAssistant(draftResponsePrompt, assistant.jarvisBotId);
    const match = draftResponseAnswer.match(/<agentResponse>([\s\S]*?)<\/agentResponse>/i);

    if (!match) {
      throw new HttpException('Internal server error', HttpStatus.BAD_REQUEST);
    }

    const finalAnswer = match[1].trim();
    return markdownToHtml(finalAnswer);
  }

  async generateFormalizeResponse(
    normalizedConversation: string[],
    givenText: string,
    variant: string,
    domain: string,
    requester?: { name: string }
  ) {
    const integrationPlatform = await this.integrationPlatformRepository.findOne({
      where: { domain },
      relations: ['team', 'team.activateAssistant'],
    });

    const assistant = await this.assistantRepository.findOne({
      where: { id: integrationPlatform?.team.activateAssistantId },
    });

    if (!assistant) {
      throw new HttpException('Assistant not found', HttpStatus.NOT_FOUND);
    }

    const lastMessage = buildFormalizePrompt(normalizedConversation, givenText, variant, requester);
    const result = await this.askAssistant(lastMessage, assistant.jarvisBotId);
    return markdownToHtml(result);
  }

  async generateAnalyzeTicket(
    normalizedConversation: string[],
    domain: string,
    averageResponseTime: string,
    lastMessageTime: string
  ) {
    const userId = this.httpContext.getUserId();

    const integrationPlatform = await this.integrationPlatformRepository.findOne({
      where: {
        domain,
      },
      relations: [
        'team',
        'team.activateAssistant',
        'team.activateAssistant.responseTemplates',
        'team.activateAssistant.rules',
      ],
    });

    if (!integrationPlatform) {
      throw new HttpException('Integration platform not found', HttpStatus.NOT_FOUND);
    }

    const assistant = await this.assistantRepository.findOne({
      where: { id: integrationPlatform.team.activateAssistantId },
    });

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { user: { id: userId }, aiAssistant: { id: assistant?.id } },
      relations: ['assistantConfig'],
    });

    const message = buildTicketAnalysisPrompt(normalizedConversation);
    const result = await this.askAssistant(message, assistant?.jarvisBotId as string);

    const commentsCount = normalizedConversation.length;
    const summaryValues = extractTagValues(result, TicketAnalyzeTags.SUMMARY);
    const toneValues = extractTagValues(result, TicketAnalyzeTags.TONE);
    const satisfactionValues = extractTagValues(result, TicketAnalyzeTags.SATISFACTION);
    const purchasingPotentialValues = extractTagValues(result, TicketAnalyzeTags.PURCHASING_POTENTIAL);
    const purchasingPotentialReason = extractTagValues(result, TicketAnalyzeTags.PURCHASING_POTENTIAL_REASON);
    const agentToneValues = extractTagValues(result, TicketAnalyzeTags.AGENT_TONE);
    const urgencyValues = extractTagValues(result, TicketAnalyzeTags.URGENCY);

    return {
      isAutoResponse: userAssistantConfig?.assistantConfig.values.autoResponse,
      commentsCount,
      averageResponseTime,
      lastMessageTime,
      sentiment: {
        tone: toneValues[0],
        satisfaction: satisfactionValues[0],
        purchasing_potential: purchasingPotentialValues[0],
        purchasing_potential_reason: purchasingPotentialReason[0],
        agent_tone: agentToneValues[0],
        urgency: urgencyValues[0],
      },
      summary: summaryValues[0],
    };
  }
}
