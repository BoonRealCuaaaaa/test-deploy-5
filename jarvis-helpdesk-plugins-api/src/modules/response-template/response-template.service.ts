import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unset } from 'lodash';
import { createOrFail, updatedOrFail } from 'src/lib/utils/repository.util';
import { Repository } from 'typeorm';

import { AIAssistant } from '../assistant/entities/assistant.entity';

import { MAX_TEMPLATES_PER_ACCOUNT } from './constants/max-templates-per-account';
import { ResponseTemplate } from './entities/response-template.entity';

@Injectable()
export class ResponseTemplateService {
  constructor(
    @InjectRepository(ResponseTemplate)
    private responseTemplateRepository: Repository<ResponseTemplate>,
    @InjectRepository(AIAssistant)
    private assistantRepository: Repository<AIAssistant>
  ) {}

  async findAllByAssisantId(assistantId: string) {
    return await this.responseTemplateRepository.find({
      where: { assistant: { id: assistantId } },
    });
  }

  async create(
    assistantId: string,
    {
      name,
      description,
      template,
      isActive = false,
    }: { name: string; description: string; template: string; isActive?: boolean }
  ) {
    const assistant = await this.assistantRepository.findOne({ where: { id: assistantId } });
    if (!assistant) {
      throw new NotFoundException('Assistant not found');
    }

    const existingTemplatesCount = await this.responseTemplateRepository.count({
      where: { assistant: { id: assistantId } },
    });

    if (existingTemplatesCount >= MAX_TEMPLATES_PER_ACCOUNT) {
      throw new BadRequestException(`Cannot create more than ${MAX_TEMPLATES_PER_ACCOUNT} templates per account`);
    }

    return await createOrFail(
      this.responseTemplateRepository,
      { name, description, template, isActive, assistant } as ResponseTemplate,
      'Create failed'
    );
  }

  async findOne(templateId: string) {
    const template = await this.responseTemplateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async update(
    templateId: string,
    {
      name,
      description,
      template,
      isActive,
    }: { name?: string; description?: string; template?: string; isActive?: boolean }
  ) {
    const updatedResponseTemplate = await this.responseTemplateRepository.findOne({
      where: { id: templateId },
      relations: ['assistant'],
    });

    if (isActive && updatedResponseTemplate) {
      await this.deactiveTemplateByAssistantId(updatedResponseTemplate.assistant.id);
    }

    const { affected } = await updatedOrFail(
      this.responseTemplateRepository,
      templateId,
      { name, description, template, isActive },
      'Update failed'
    );

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    unset(updatedResponseTemplate, 'assistant');

    return {
      template: {
        name: name ?? updatedResponseTemplate?.name,
        description: description ?? updatedResponseTemplate?.description,
        template: template ?? updatedResponseTemplate?.template,
        isActive: isActive ?? updatedResponseTemplate?.isActive,
        ...updatedResponseTemplate,
      },
      updated: affected > 0,
    };
  }

  async activateTemplate(templateId: string) {
    return await this.update(templateId, { isActive: true });
  }

  async deactiveTemplateByAssistantId(assistantId: string) {
    await updatedOrFail(
      this.responseTemplateRepository,
      { isActive: true, assistant: { id: assistantId } },
      { isActive: false },
      'Update failed'
    );
  }

  async delete(templateId: string) {
    const { affected } = await this.responseTemplateRepository.softDelete(templateId);
    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      id: templateId,
      deleted: affected > 0,
    };
  }
}
