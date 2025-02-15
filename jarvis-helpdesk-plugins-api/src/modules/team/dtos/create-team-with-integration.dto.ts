import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlatformTypeEnum } from 'src/modules/integration-platform/constants/platform-type';

export class CreateTeamWithIntegrationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({
    required: true,
    description: 'description of the severity property',
    enum: PlatformTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(PlatformTypeEnum)
  type: PlatformTypeEnum;

  @ApiProperty({
    required: true,
    example: 'zendesk.com.vn',
  })
  @IsNotEmpty()
  @IsString()
  domain: string;
}
