import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsUUIDQueryParam } from 'src/shared/decorators/query-params.decorator';

export class CreateResponseTemplateDto {
  @ApiProperty({
    required: true,
    example: 'Email Template',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    required: true,
    example: 'Template is used for email channel',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;

  @ApiProperty({
    required: true,
    example: 'Hello {customer}, {answer}',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  template: string;

  @ApiProperty({
    required: true,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsUUIDQueryParam()
  assistantId: string;
}
