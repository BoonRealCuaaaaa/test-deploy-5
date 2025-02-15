import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UUIDParam } from 'src/shared/decorators/params.decorator';

import { CreateIntegrationPlatformDto } from './dtos/create-integration-platform.dto';
import { IntegrationPlatformWithQueryParamsDto } from './dtos/integration-platform-with-query-params.dto';
import { UpdateIntegrationPlatformDto } from './dtos/update-integration-platform.dto';
import { IntegrationPlatformService } from './integration-platform.service';

@Auth()
@ApiTags('integration-platforms')
@Controller('integration-platforms')
export class IntegrationPlatformController {
  constructor(private readonly integrationPlatformService: IntegrationPlatformService) {}

  @Get()
  findAllByAssisant(@Query() integrationPlatformWithQueryParamsDto: IntegrationPlatformWithQueryParamsDto) {
    return this.integrationPlatformService.findAllByTeamId(integrationPlatformWithQueryParamsDto.teamId);
  }

  @Post()
  async create(@Body() createIntegrationPlatformDto: CreateIntegrationPlatformDto) {
    const { type, domain, isEnable, teamId } = createIntegrationPlatformDto;

    return this.integrationPlatformService.create(teamId, { type, domain, isEnable });
  }

  @Get(':integrationPlatformId')
  findOne(@UUIDParam('integrationPlatformId') integrationPlatformId: string) {
    return this.integrationPlatformService.findOne(integrationPlatformId);
  }

  @Patch(':integrationPlatformId')
  async update(
    @UUIDParam('integrationPlatformId') integrationPlatformId: string,
    @Body() updateIntegrationPlatformDto: UpdateIntegrationPlatformDto
  ) {
    const { type, domain, isEnable } = updateIntegrationPlatformDto;
    return await this.integrationPlatformService.update(integrationPlatformId, { type, domain, isEnable });
  }

  @Delete(':integrationPlatformId')
  async remove(@UUIDParam('integrationPlatformId') integrationPlatformId: string) {
    return await this.integrationPlatformService.delete(integrationPlatformId);
  }
}
