import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationDTO {
  @ApiProperty({ required: true })
  code: string;
}
