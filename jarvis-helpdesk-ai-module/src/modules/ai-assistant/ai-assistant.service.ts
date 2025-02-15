import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/shared/dtos/pagination.dtos';
import { KbCoreClientService } from 'src/shared/modules/kb-core-client/kb-core-client.service';

@Injectable()
export class AiAssistantService {
  constructor(private kbCoreClient: KbCoreClientService) {}

  async askAssistant(message: string, kbAssistantId: string) {
    const { openAiThreadId } = await this.kbCoreClient.thread.createThread(kbAssistantId);

    return await this.kbCoreClient.assistant.ask(kbAssistantId, { message, openAiThreadId });
  }

  async getImportedKnowledgeInAssistantByAssistantId(
    assistantId: string,
    { offset, limit, order_field, q, order }: PageOptionsDto
  ) {
    return await this.kbCoreClient.knowledge.getListByAssisantId(assistantId, {
      offset,
      limit,
      order_field,
      q,
      order,
    });
  }

  async importKnowledge(kbAssistantId: string, knowledgeId: string) {
    return await this.kbCoreClient.assistant.importKnowledge(kbAssistantId, { knowledgeId });
  }

  async removeKnowledge(kbAssistantId: string, knowledgeId: string) {
    return await this.kbCoreClient.assistant.removeKnowledge(kbAssistantId, { knowledgeId });
  }

  async createAssistant(assistantName: string, instructions?: string, description?: string) {
    return await this.kbCoreClient.assistant.createAssistant(assistantName, instructions, description);
  }
}
