import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ required: true })
  @IsString()
  displayName: string;
}
