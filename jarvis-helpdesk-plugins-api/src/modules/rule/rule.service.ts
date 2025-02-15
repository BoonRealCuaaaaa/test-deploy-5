import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/lib/helpers/pagination.helper';
import { PaginationOrderOption } from 'src/lib/interfaces/pagination-options.interface';
import { createOrFail, updatedOrFail } from 'src/lib/utils/repository.util';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';

import { AIAssistant } from '../assistant/entities/assistant.entity';
import { GettingStartedTaskTypeEnum } from '../getting-started/constants/getting-started-task-type';
import { TeamGettingStartedTask } from '../getting-started/entities/team-getting-started-task.entity';

import { Rule } from './entities/rule.entity';

type RuleWithQueryParamsInput = {
  assistantId: string;
  //search by ids
  ids?: string | string[];
  //search by keyword
  query?: string;
  offset?: number;
  limit?: number;
  // 'Order result, e.g. order=createdAt:DESC'
  order?: PaginationOrderOption;
};

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
    @InjectRepository(AIAssistant)
    private aiAssistantRepository: Repository<AIAssistant>,
    @InjectRepository(TeamGettingStartedTask)
    private teamGettingStartedTaskRepository: Repository<TeamGettingStartedTask>,
    private dataSource: DataSource
  ) {}
  async findAllWithPaginationByAssistantId(ruleWithQueryParamsInput: RuleWithQueryParamsInput) {
    const { limit, offset, order, query, assistantId } = ruleWithQueryParamsInput;

    const orderFindOptions = order ? { [order.field]: order.direction } : undefined;

    const findOptionsWhere: FindOptionsWhere<Rule> = {
      content: query ? ILike(`%${query}%`) : undefined,
      aiAssistant: { id: assistantId },
    };

    return paginate(
      this.ruleRepository,
      {
        order: orderFindOptions,
        where: findOptionsWhere,
        take: limit,
        skip: offset,
      },
      limit,
      offset
    );
  }

  async create(assistantId: string, { content, isEnable = false }: { content: string; isEnable?: boolean }) {
    const aiAssistant = await this.aiAssistantRepository.findOne({ where: { id: assistantId } });

    if (!aiAssistant) {
      throw new NotFoundException('AI Assistant not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const assistant = await this.aiAssistantRepository.findOne({
      where: { id: assistantId },
      relations: ['teamOwner'],
    });

    if (!assistant) {
      throw new NotFoundException('Assistant not found');
    }

    try {
      const teamGettingStartedTask = await this.teamGettingStartedTaskRepository.findOne({
        where: {
          team: { id: assistant.teamOwner.id },
          gettingStartedTask: { name: GettingStartedTaskTypeEnum.RULE },
        },
      });

      if (teamGettingStartedTask) {
        teamGettingStartedTask.deletedAt = new Date();
        await this.teamGettingStartedTaskRepository.save(teamGettingStartedTask);
      }

      const integrationPlatform = await createOrFail(
        this.ruleRepository,
        { content, isEnable, aiAssistant } as Rule,
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

  async findOne(ruleId: string) {
    const rule = await this.ruleRepository.findOne({ where: { id: ruleId } });

    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    return rule;
  }

  async update(ruleId: string, { content, isEnable }: { content?: string; isEnable?: boolean }) {
    const { affected } = await updatedOrFail(this.ruleRepository, ruleId, { content, isEnable }, 'Update failed');

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    const updatedRule = await this.findOne(ruleId);

    return {
      rule: updatedRule,
      updated: affected > 0,
    };
  }

  async delete(ruleId: string) {
    const { affected } = await this.ruleRepository.softDelete(ruleId);

    if (!affected) {
      throw new BadRequestException('Given Id not found');
    }

    return {
      id: ruleId,
      deleted: affected > 0,
    };
  }
}
