import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssistantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assistantName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
