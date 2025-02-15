import { Controller, Delete, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UUIDParam } from 'src/shared/decorators/params.decorator';

import { GettingStartedTaskTypeEnum } from './constants/getting-started-task-type';
import { GettingStartedTaskWithQueryParamsDto } from './dtos/getting-started-task-with-query-params.dto';
import { GettingStartedTaskService } from './getting-started-task.service';

@Auth()
@ApiTags('getting-started-tasks')
@Controller('getting-started-tasks')
export class GettingStartedTaskController {
  constructor(private readonly gettingStartedTaskService: GettingStartedTaskService) {}

  @Get()
  findAllByTeam(@Query() gettingStartedTaskWithQueryParamsDto: GettingStartedTaskWithQueryParamsDto) {
    return this.gettingStartedTaskService.findAllByTeamId(gettingStartedTaskWithQueryParamsDto.teamId);
  }

  @Get('names/:name')
  findOneByTeam(
    @Param('name', new ParseEnumPipe(GettingStartedTaskTypeEnum)) name: GettingStartedTaskTypeEnum,
    @Query() gettingStartedTaskWithQueryParamsDto: GettingStartedTaskWithQueryParamsDto
  ) {
    return this.gettingStartedTaskService.findOneByTeamIdAndName(gettingStartedTaskWithQueryParamsDto.teamId, name);
  }

  @Delete(':teamGettingStartedTaskId')
  delete(@UUIDParam('teamGettingStartedTaskId') teamGettingStartedTaskId: string) {
    return this.gettingStartedTaskService.delete(teamGettingStartedTaskId);
  }
}
