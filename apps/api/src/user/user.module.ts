import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { UsersController } from './user.controller.js';
import { userProviders } from './user.providers.js';
import { UserService } from './user.service.js';
import { RoleModule } from '../role/role.module.js';

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [UsersController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UsersModule {
  constructor() {}
}
