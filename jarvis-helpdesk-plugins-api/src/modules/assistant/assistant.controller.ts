import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/shared/constants/roles';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UUIDParam } from 'src/shared/decorators/params.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';

import { ImportKnowledgeDto } from './dtos/import-knowledge.dto';
import { UpdateAssistantDto } from './dtos/update-assistant.dto';
import { AssistantService } from './assistant.service';

@Auth()
@ApiTags('assistants')
@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('teams/:teamId')
  async findOneByTeamId(@UUIDParam('teamId') teamId: string) {
    return await this.assistantService.findOneByTeamId(teamId);
  }

  @Patch(':assistantId')
  async updateAssistantConfigByAssistantId(
    @UUIDParam('assistantId') assistantId: string,
    @Body() updateAssistantDto: UpdateAssistantDto
  ) {
    const { toneOfAI, language, includeReference, autoResponse, enableTemplate } = updateAssistantDto;
    const config = { toneOfAI, language, includeReference, autoResponse, enableTemplate };
    return this.assistantService.updateAssistantConfigByAssistantId(assistantId, config);
  }

  @Patch('domain/:domain')
  async updateByDomain(@Param('domain') domain: string, @Body() updateAssistantDto: UpdateAssistantDto) {
    return this.assistantService.updateAssistantConfigByDomain(domain, updateAssistantDto);
  }

  @Delete(':assistantId')
  @Roles(UserRole.ADMIN)
  async remove(@UUIDParam('assistantId') assistantId: string) {
    return await this.assistantService.delete(assistantId);
  }

  @Post('/knowledge')
  async importKnowledge(@Body() dto: ImportKnowledgeDto) {
    const { knowledgeId, assistantId } = dto;

    return await this.assistantService.importKnowledge(assistantId, knowledgeId);
  }
}
