import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createOrFail, updatedOrFail } from 'src/lib/utils/repository.util';
import { DataSource, Repository } from 'typeorm';

import { GettingStartedTaskTypeEnum } from '../getting-started/constants/getting-started-task-type';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';
import { Team } from '../team/entities/team.entity';

import { PlatformTypeEnum } from './constants/platform-type';
import { IntegrationPlatform } from './entities/integration-platform.entity';

@Injectable()
export class IntegrationPlatformService {
  constructor(
    @InjectRepository(IntegrationPlatform)
    private integrationPlatformRepository: Repository<IntegrationPlatform>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamGettingStartedTask)
    private teamGettingStartedTaskRepository: Repository<TeamGettingStartedTask>,
    private dataSource: DataSource
  ) {}

  async findAllByTeamId(teamId: string) {
    return await this.integrationPlatformRepository.find({
      where: { team: { id: teamId } },
    });
  }

  async create(
    teamId: string,
    {
      type = PlatformTypeEnum.ZENDESK,
      domain,
      isEnable = true,
    }: {
      type: PlatformTypeEnum;
      domain: string;
      isEnable?: boolean;
    }
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    try {
      const teamGettingStartedTask = await this.teamGettingStartedTaskRepository.findOne({
        where: {
          team: { id: team.id },
          gettingStartedTask: { name: GettingStartedTaskTypeEnum.INTEGRATION },
        },
      });

      if (teamGettingStartedTask) {
        teamGettingStartedTask.deletedAt = new Date();
        await this.teamGettingStartedTaskRepository.save(teamGettingStartedTask);
      }

      const integrationPlatform = await createOrFail(
        this.integrationPlatformRepository,
        { type, domain, team, isEnable } as IntegrationPlatform,
        'Create failed'
      );

      await queryRunner.commitTransaction();
      return integrationPlatform;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(integrationPlatformId: string) {
    const integrationPlatform = await this.integrationPlatformRepository.findOne({
      where: { id: integrationPlatformId },
    });

    if (!integrationPlatform) {
      throw new NotFoundException('Integration Platform not found');
    }

    return integrationPlatform;
  }

  async findOneByDomain(domain: string) {
    return await this.integrationPlatformRepository.findOneOrFail({
      where: { domain },
      relations: ['assistant'],
    });
  }

  async update(
    integrationPlatformId: string,
    { type, domain, isEnable }: { type?: PlatformTypeEnum; domain?: string; isEnable?: boolean }
  ) {
    const { affected } = await updatedOrFail(
      this.integrationPlatformRepository,
      integrationPlatformId,
      { type, domain, isEnable },
      'Update failed'
    );

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    const updatedIntegrationPlatform = await this.findOne(integrationPlatformId);

    return {
      integrationPlatform: updatedIntegrationPlatform,
      updated: affected > 0,
    };
  }

  async delete(integrationPlatformId: string) {
    const { affected } = await this.integrationPlatformRepository.softDelete(integrationPlatformId);

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      id: integrationPlatformId,
      deleted: affected > 0,
    };
  }
}
