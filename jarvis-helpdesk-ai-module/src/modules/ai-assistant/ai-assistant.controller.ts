import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/shared/decorators/params.decorator';
import { PageOptionsDto } from 'src/shared/dtos/pagination.dtos';

import { AskAssistantDto } from './dtos/ask-assistant.dto';
import { CreateAssistantDto } from './dtos/create-assistant.dto';
import { ImportKnowledgeReqDto } from './dtos/import-knowledge-req.dto';
import { AiAssistantService } from './ai-assistant.service';

@ApiTags('Ai Assistant')
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private aiAssistantService: AiAssistantService) {}

  @ApiOperation({ summary: 'Ask assistant' })
  @HttpCode(HttpStatus.OK)
  @Post('/generate-response')
  async askAssistant(@Body() dto: AskAssistantDto) {
    const { message, kbAssistantId } = dto;
    return await this.aiAssistantService.askAssistant(message, kbAssistantId);
  }

  @ApiOperation({ summary: 'Create an assistant' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createAssistant(@Body() dto: CreateAssistantDto) {
    const { assistantName, instructions, description } = dto;
    return await this.aiAssistantService.createAssistant(assistantName, instructions, description);
  }

  @Get('/:assistantId/knowledges')
  async getImportedKnowledgeInAssistant(@UUIDParam('assistantId') assistantId: string, @Query() dto: PageOptionsDto) {
    return await this.aiAssistantService.getImportedKnowledgeInAssistantByAssistantId(assistantId, dto);
  }

  @ApiOperation({ summary: 'Import knowledge to assistant' })
  @HttpCode(HttpStatus.OK)
  @Post('/knowledge')
  async importKnowledge(@Body() dto: ImportKnowledgeReqDto) {
    const { knowledgeId, kbAssistantId } = dto;
    return await this.aiAssistantService.importKnowledge(kbAssistantId, knowledgeId);
  }

  @ApiOperation({ summary: 'Remove knowledge from assistant' })
  @HttpCode(HttpStatus.OK)
  @Delete('/knowledge')
  async removeKnowledge(@Body() dto: ImportKnowledgeReqDto) {
    const { knowledgeId, kbAssistantId } = dto;
    return await this.aiAssistantService.removeKnowledge(kbAssistantId, knowledgeId);
  }
}
