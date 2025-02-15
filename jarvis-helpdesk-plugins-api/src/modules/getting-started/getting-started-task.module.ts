import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { GettingStartedTask } from './entities/getting-started-task.entity';
import { TeamGettingStartedTask } from './entities/team-getting-started-task.entity';
import { GettingStartedTaskController } from './getting-started-task.controller';
import { GettingStartedTaskService } from './getting-started-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([GettingStartedTask, TeamGettingStartedTask]), forwardRef(() => AuthModule)],
  controllers: [GettingStartedTaskController],
  providers: [GettingStartedTaskService],
  exports: [GettingStartedTaskService],
})
export class GettingStartedTaskModule {}
