import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Role } from '@wanderlust/core';
import { RoleService } from '../role/role.service.js';

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
        roles: [adminRole._id],
      });
    }
  }

  @Get('global-admin')
  async getGlobalAdmin() {
    const adminRole = await this.rolesService.findOrCreateAdminRole();
    return this.findOneByRole(adminRole);
  }

  async findOneByRole(role: Role) {
    return await this.usersService.findOneByRole({ roles: [role._id] });
  }
}
