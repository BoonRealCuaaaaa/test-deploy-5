import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { updatedOrFail } from 'src/lib/utils/repository.util';
import { AiAssistantService } from 'src/shared/modules/ai-assistant/ai-assistant.service';
import { HttpRequestContextService } from 'src/shared/modules/http-request-context/http-request-context.service';
import { Repository } from 'typeorm';

import { IntegrationPlatform } from '../integration-platform/entities/integration-platform.entity';

import { AIAssistant } from './entities/assistant.entity';
import { AssistantConfig } from './entities/assistant-config.entity';
import { UserAssistantConfig } from './entities/user-assistant-config.entity';

@Injectable()
export class AssistantService {
  constructor(
    private readonly httpContext: HttpRequestContextService,
    @InjectRepository(AIAssistant)
    private aiAssistantRepository: Repository<AIAssistant>,
    @InjectRepository(AssistantConfig)
    private assistantConfigRepository: Repository<AssistantConfig>,
    @InjectRepository(UserAssistantConfig)
    private userAssistantConfigRepository: Repository<UserAssistantConfig>,
    private aiAssistantService: AiAssistantService,
    @InjectRepository(IntegrationPlatform)
    private integrationPlatformRepository: Repository<IntegrationPlatform>
  ) {}

  async findAllByTeamId(teamId: string) {
    return this.aiAssistantRepository.find({ where: { teamOwner: { id: teamId } } });
  }

  async findOne(assistantId: string) {
    const userId = this.httpContext.getUserId();

    const assistant = await this.aiAssistantRepository.findOne({
      where: { id: assistantId },
    });

    if (!assistant) {
      throw new NotFoundException('AI-Assistant not found');
    }

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { user: { id: userId }, aiAssistant: { id: assistant.id } },
      relations: ['assistantConfig'],
    });

    return {
      id: assistant.id,
      createdAt: assistant.createdAt,
      updatedAt: assistant.updatedAt,
      ...userAssistantConfig?.assistantConfig.values,
    };
  }

  async findOneByTeamId(teamId: string) {
    const userId = this.httpContext.getUserId();

    const assistant = await this.aiAssistantRepository.findOne({
      where: { teamOwner: { id: teamId } },
    });

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { aiAssistant: { id: assistant?.id }, user: { id: userId } },
      relations: ['assistantConfig'],
    });

    if (!assistant) {
      throw new BadRequestException("User don't have any assistant");
    }

    return {
      id: assistant.id,
      ...userAssistantConfig?.assistantConfig.values,
      createdAt: assistant.createdAt,
      updatedAt: assistant.updatedAt,
    };
  }

  async updateAssistantConfigByDomain(
    domain: string,
    {
      toneOfAI,
      language,
      includeReference,
      autoResponse,
      enableTemplate,
    }: {
      toneOfAI?: string;
      language?: string;
      includeReference?: boolean;
      autoResponse?: boolean;
      enableTemplate?: boolean;
    }
  ) {
    const userId = this.httpContext.getUserId();

    const assistantId = (
      await this.integrationPlatformRepository.findOne({
        where: { domain },
        relations: ['team', 'team.activateAssistant'],
      })
    )?.team.activateAssistantId;

    if (!assistantId) {
      throw new BadRequestException('Domain is not found');
    }

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { user: { id: userId }, aiAssistant: { id: assistantId } },
      relations: ['assistantConfig'],
    });

    const updatedValues = {
      ...userAssistantConfig?.assistantConfig.values,
      ...Object.fromEntries(
        Object.entries({
          toneOfAI,
          language,
          includeReference,
          autoResponse,
          enableTemplate,
        }).filter(([_, v]) => v !== undefined)
      ),
    };

    const { affected } = await updatedOrFail(
      this.assistantConfigRepository,
      { id: userAssistantConfig?.assistantConfig.id },
      { values: updatedValues } as AssistantConfig,
      'Update failed'
    );

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      updated: affected > 0,
      assistant: await this.findOne(assistantId),
    };
  }

  async updateAssistantConfigByAssistantId(
    assistantId: string,
    {
      toneOfAI,
      language,
      includeReference,
      autoResponse,
      enableTemplate,
    }: {
      toneOfAI?: string;
      language?: string;
      includeReference?: boolean;
      autoResponse?: boolean;
      enableTemplate?: boolean;
    }
  ) {
    const userId = this.httpContext.getUserId();

    const userAssistantConfig = await this.userAssistantConfigRepository.findOne({
      where: { user: { id: userId }, aiAssistant: { id: assistantId } },
      relations: ['assistantConfig'],
    });

    const updatedValues = {
      ...userAssistantConfig?.assistantConfig.values,
      ...Object.fromEntries(
        Object.entries({
          toneOfAI,
          language,
          includeReference,
          autoResponse,
          enableTemplate,
        }).filter(([_, v]) => v !== undefined)
      ),
    };

    const { affected } = await updatedOrFail(
      this.assistantConfigRepository,
      { id: userAssistantConfig?.assistantConfig.id },
      { values: updatedValues } as AssistantConfig,
      'Update failed'
    );

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    const assistant = await this.findOne(assistantId);

    return {
      updated: affected > 0,
      assistant,
    };
  }

  async delete(assistantId: string) {
    const { affected } = await this.aiAssistantRepository.softDelete(assistantId);

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      id: assistantId,
      deleted: affected > 0,
    };
  }

  async importKnowledge(assistantId: string, knowledgeId: string) {
    const assistant = await this.aiAssistantRepository.findOne({
      where: { id: assistantId },
    });

    if (!assistant) {
      throw new NotFoundException('AI-Assistant not found');
    }

    return await this.aiAssistantService.importKnowledgeToAssistant(assistant.jarvisBotId, knowledgeId);
  }

  async createAssistantConfig(assistantId: string, userId: string) {
    const assistant = await this.aiAssistantRepository.findOne({
      where: { id: assistantId },
    });

    if (!assistant) {
      throw new NotFoundException('AI-Assistant not found');
    }

    const assistantConfig = this.assistantConfigRepository.create({
      values: {
        toneOfAI: 'friendly',
        language: 'English',
        includeReference: false,
        autoResponse: false,
        enableTemplate: false,
      },
    });

    await this.assistantConfigRepository.save(assistantConfig);

    const userAssistantConfig = this.userAssistantConfigRepository.create({
      user: { id: userId },
      aiAssistant: { id: assistantId },
      assistantConfig,
      metadata: {},
    });

    await this.userAssistantConfigRepository.save(userAssistantConfig);

    return userAssistantConfig;
  }
}
