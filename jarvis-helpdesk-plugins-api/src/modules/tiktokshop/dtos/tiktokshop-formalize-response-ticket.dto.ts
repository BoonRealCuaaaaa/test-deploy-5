import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ChatMessage } from '../types/tiktokshop.type';

export class TiktokshopFormalizeResponseTicketDto {
  @ApiProperty({
    required: true,
  })
  conversation: ChatMessage[];

  @ApiProperty()
  @IsNotEmpty()
  givenText: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  variant: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  domain: string;
}
