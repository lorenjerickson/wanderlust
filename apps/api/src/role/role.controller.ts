import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service.js';

@Controller('api/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAll() {
    return this.roleService.findAll();
  }

  @Post()
  async createRole(@Body() body) {
    const user = await this.roleService.findOneByName(body.name);
    if (user) {
      throw new Error('Role already exists');
    }
    return this.roleService.create(body);
  }
}
