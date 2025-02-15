import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';

import { TiktokshopDraftResponseTicketDto } from './dtos/tiktokshop-draft-response-ticket.dto';
import { TiktokshopFormalizeResponseTicketDto } from './dtos/tiktokshop-formalize-response-ticket.dto';
import { TiktokshopTicketAnalyzeTicketDto } from './dtos/tiktokshop-ticket-analyze.dto';
import { checkTicketConversation } from './libs/utils';
import { TiktokshopService } from './tiktokshop.service';

@ApiTags('Tiktokshop')
@Controller('tiktokshop')
export class TiktokshopController {
  constructor(private aiGenerateResponseService: TiktokshopService) {}

  @Auth()
  @Post('/draft-response')
  async draftResponse(@Body() dto: TiktokshopDraftResponseTicketDto) {
    const { conversation, domain } = dto;
    return await this.aiGenerateResponseService.generateDraftResponse(conversation, domain);
  }

  @Auth()
  @Post('/formalize-response')
  async formalizeResponse(@Body() dto: TiktokshopFormalizeResponseTicketDto) {
    const { conversation, givenText, variant, domain } = dto;
    if (checkTicketConversation(conversation) == false) {
      throw new BadRequestException('Invalid ticket conversation');
    }
    return await this.aiGenerateResponseService.generateFormalizeResponse(conversation, givenText, variant, domain);
  }

  @Auth()
  @Post('/ticket-analyze')
  async ticketAnalyze(@Body() dto: TiktokshopTicketAnalyzeTicketDto) {
    const { conversation, domain } = dto;
    return await this.aiGenerateResponseService.generateAnalyzeTicket(conversation, domain);
  }

  @Get('/verify-domain/:domain')
  async verifyDomain(@Param('domain') domain: string) {
    return await this.aiGenerateResponseService.findDomain(domain);
  }
}
