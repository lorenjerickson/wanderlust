import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async roles(@Body() body: { name: string }) {
    return await this.rolesService.create(body);
  }
}
