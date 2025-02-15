import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GettingStartedTaskTypeEnum } from './constants/getting-started-task-type';
import { GettingStartedTask } from './entities/getting-started-task.entity';
import { TeamGettingStartedTask } from './entities/team-getting-started-task.entity';

@Injectable()
export class GettingStartedTaskService {
  constructor(
    @InjectRepository(TeamGettingStartedTask)
    private teamGettingStartedTaskRepository: Repository<TeamGettingStartedTask>,
    @InjectRepository(GettingStartedTask)
    private gettingStartedTaskRepository: Repository<GettingStartedTask>
  ) {}

  async findAllByTeamId(teamId: string) {
    const teamGettingStartedTasks = await this.teamGettingStartedTaskRepository.find({
      where: { team: { id: teamId } },
      relations: ['gettingStartedTask'],
    });
    return teamGettingStartedTasks.map((teamGettingStartedTask) => {
      return { ...teamGettingStartedTask.gettingStartedTask, id: teamGettingStartedTask.id };
    });
  }

  async findOneByTeamIdAndName(teamId: string, name: GettingStartedTaskTypeEnum) {
    const teamGettingStartedTask = await this.teamGettingStartedTaskRepository.findOne({
      where: { team: { id: teamId }, gettingStartedTask: { name: name } },
      relations: ['gettingStartedTask'],
    });

    return { ...teamGettingStartedTask?.gettingStartedTask, id: teamGettingStartedTask?.id };
  }

  async createDefaultIntegrationTasks(teamId: string) {
    let defaultIntegrationGettingStartedTask = await this.gettingStartedTaskRepository.findOne({
      where: { name: GettingStartedTaskTypeEnum.INTEGRATION },
    });

    if (!defaultIntegrationGettingStartedTask) {
      defaultIntegrationGettingStartedTask = await this.gettingStartedTaskRepository.save(
        this.gettingStartedTaskRepository.create({
          title: 'Integrate your first platform',
          link: `/ai-settings/integrations`,
          name: GettingStartedTaskTypeEnum.INTEGRATION,
        })
      );
    }

    const defaultTeamGettingStartedTask = this.teamGettingStartedTaskRepository.create({
      team: { id: teamId },
      gettingStartedTask: defaultIntegrationGettingStartedTask,
    });
    await this.teamGettingStartedTaskRepository.save(defaultTeamGettingStartedTask);

    return defaultIntegrationGettingStartedTask;
  }

  async createDefaultRuleTasks(teamId: string) {
    let defaultRuleGettingStartedTask = await this.gettingStartedTaskRepository.findOne({
      where: { name: GettingStartedTaskTypeEnum.RULE },
    });

    if (!defaultRuleGettingStartedTask) {
      defaultRuleGettingStartedTask = await this.gettingStartedTaskRepository.save(
        this.gettingStartedTaskRepository.create({
          title: 'Add rules to your AI',
          link: `/ai-settings/rules`,
          name: GettingStartedTaskTypeEnum.RULE,
        })
      );
    }

    const defaultTeamGettingStartedTask = this.teamGettingStartedTaskRepository.create({
      team: { id: teamId },
      gettingStartedTask: defaultRuleGettingStartedTask,
    });
    await this.teamGettingStartedTaskRepository.save(defaultTeamGettingStartedTask);

    return defaultRuleGettingStartedTask;
  }

  async delete(teamGettingStartedTaskId: string) {
    const { affected } = await this.teamGettingStartedTaskRepository.softDelete(teamGettingStartedTaskId);

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      id: teamGettingStartedTaskId,
      deleted: affected > 0,
    };
  }
}
