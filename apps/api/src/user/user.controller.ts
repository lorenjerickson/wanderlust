import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from '../role/role.service.js';
import { UserService } from './user.service.js';
import { RoleName } from '@wanderlust/core';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly rolesService: RoleService,
  ) {}

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
    const globalAdmin = await this.getGlobalAdmin();
    if (globalAdmin) {
      throw new Error('Global admin already exists');
    } else {
      const adminRole = await this.rolesService.findOrCreateAdminRole();
      return this.usersService.create({
        ...body,
        roles: [adminRole],
      });
    }
  }

  @Get('global-admin')
  async getGlobalAdmin() {
    const adminRole = await this.rolesService.findOrCreateAdminRole();
    return this.findOneByRoleName(adminRole.name);
  }

  async findOneByRoleName(name: RoleName) {
    return await this.usersService.findOneByRoleName(name);
  }
}
