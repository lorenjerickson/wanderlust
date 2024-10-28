import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '@wanderlust/core';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body) {
    const user = await this.usersService.findOneByUsername(body.emailAddress);
    if (user) {
      throw new Error('User already exists');
    }
    return this.usersService.create(body);
  }

  @Post('global-admin')
  async createGlobalAdmin(@Body() body) {
    const globalAdmin = await this.fetchGlobalAdmin();
    if (globalAdmin) {
      throw new Error('Global admin already exists');
    } else {
      return this.usersService.create({
        ...body,
        roles: [Role.GlobalAdmin],
      });
    }
  }

  @Get('global-admin')
  async fetchGlobalAdmin() {
    return this.usersService.findOneByRole(Role.GlobalAdmin);
  }
}
