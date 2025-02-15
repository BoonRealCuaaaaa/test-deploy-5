import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAssistantDto {
  @ApiProperty({ required: false, example: 'Professional' })
  @IsOptional()
  @IsString()
  toneOfAI?: string;

  @ApiProperty({ required: false, example: 'English' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  includeReference?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  autoResponse?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  enableTemplate?: boolean;
}
