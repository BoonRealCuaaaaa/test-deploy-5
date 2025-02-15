import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateIntegrationPlatformDto } from './create-integration-platform.dto';

export class UpdateIntegrationPlatformDto extends PartialType(
  OmitType(CreateIntegrationPlatformDto, ['teamId'] as const)
) {}
