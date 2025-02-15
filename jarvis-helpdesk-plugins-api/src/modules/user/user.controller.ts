import { Controller, Delete, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/shared/decorators/params.decorator';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@UUIDParam('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Delete(':userId')
  async remove(@UUIDParam('userId') userId: string) {
    return await this.userService.delete(userId);
  }
}
