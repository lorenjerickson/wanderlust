import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service.js';

@Controller('api/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAll() {
    try {
      return this.roleService.findAll();
    } catch (error) {
      console.error('Error getting all roles:', error);
      throw error;
    }
  }

  @Post()
  async createRole(@Body() body) {
    try {
      const user = await this.roleService.findOneByName(body.name);
      if (user) {
        throw new Error('Role already exists');
      }
      return this.roleService.create(body);
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }
}
