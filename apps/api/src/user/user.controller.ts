import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() body) {
    return this.usersService.create(body.username, body.password);
  }
}
