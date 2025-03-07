import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { RoleController } from './role.controller.js';
import { roleProviders } from './role.providers.js';
import { RoleService } from './role.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService],
})
export class RoleModule {
  constructor() {}
}
