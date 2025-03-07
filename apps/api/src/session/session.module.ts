import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module.js';
import { SessionController } from './session.controller.js';
import { SessionService } from './session.service.js';
import { sessionProviders } from './session.providers.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [SessionController],
  providers: [SessionService, ...sessionProviders],
})
export class SessionModule {}
