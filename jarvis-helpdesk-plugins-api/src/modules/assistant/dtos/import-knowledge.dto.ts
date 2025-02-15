import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ImportKnowledgeDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  knowledgeId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  assistantId: string;
}
