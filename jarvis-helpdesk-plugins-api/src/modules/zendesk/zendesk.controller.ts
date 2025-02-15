import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';

import { ZendeskDraftResponseTicketDto } from './dtos/zendesk-draft-response-ticket.dto';
import { ZendeskFormalizeResponseTicketDto } from './dtos/zendesk-formalize-response-ticket.dto';
import { ZendeskTicketAnalyzeTicketDto } from './dtos/zendesk-ticket-analyze.dto';
import { checkTicketConversation } from './lib/utils';
import { ZendeskService } from './zendesk.service';

@Auth()
@ApiTags('Zendesk')
@Controller('zendesk')
export class ZendeskController {
  constructor(private aiGenerateResponseService: ZendeskService) {}

  @Auth()
  @Post('/draft-response')
  async draftResponse(@Body() dto: ZendeskDraftResponseTicketDto) {
    const { conversation, requester, via, domain } = dto;
    return await this.aiGenerateResponseService.generateDraftResponse(conversation, requester, via, domain);
  }

  @Auth()
  @Post('/formalize-response')
  async formalizeResponse(@Body() dto: ZendeskFormalizeResponseTicketDto) {
    const { payload, givenText, variant, domain } = dto;
    const ticket = payload.ticket;
    if (checkTicketConversation(ticket.conversation) == false) {
      throw new BadRequestException('Invalid ticket conversation');
    }
    return await this.aiGenerateResponseService.generateFormalizeResponse(ticket, givenText, variant, domain);
  }

  @Auth()
  @Post('/ticket-analyze')
  async ticketAnalyze(@Body() dto: ZendeskTicketAnalyzeTicketDto) {
    const { ticket, domain } = dto;
    return await this.aiGenerateResponseService.generateAnalyzeTicket(ticket, domain);
  }

  @Auth()
  @Get('/verify-domain/:domain')
  async findOne(@Param('domain') domain: string) {
    return await this.aiGenerateResponseService.findDomain(domain);
  }
}
