import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../domains/user';
import { UserService } from '../services/user.service';
import { UserCreateDto } from './dtos/user.create.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(`/user`)
  async create(@Body() data: UserCreateDto): Promise<User> {
    const user = await this.userService.create(data.id, data.password);
    return user;
  }

  @Get(`/user/:id`)
  async findById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    return user;
  }
}
