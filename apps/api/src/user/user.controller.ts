import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@wanderlust/core';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard.js';
import { RoleService } from '../role/role.service.js';
import { UserService } from './user.service.js';

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

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createUser(@Body() body) {
    try {
      const user = await this.usersService.findOneByUsername(body.emailAddress);
      if (user) {
        throw new Error('User already exists');
      }
      return this.usersService.create(body);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('global-admin')
  async createGlobalAdmin(@Body() body) {
    try {
      const globalAdmin = await this.getGlobalAdmin();
      if (globalAdmin) {
        throw new Error('Global admin already exists');
      } else {
        const adminRole = await this.rolesService.findOrCreateAdminRole();
        return this.usersService.create({
          ...body,
          roles: [adminRole?._id],
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('global-admin')
  async getGlobalAdmin() {
    try {
      const adminRole = await this.rolesService.findOrCreateAdminRole();
      const admin = await this.findOneByRole(adminRole);
      if (!admin) {
        return null;
      }

      return { ...admin, password: undefined };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOneByRole(role: Role) {
    try {
      return this.usersService.findOneByRole(role);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
