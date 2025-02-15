import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailInviteMemberDTO {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}
