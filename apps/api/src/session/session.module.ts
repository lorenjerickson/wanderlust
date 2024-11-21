import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { sessionProviders } from './session.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [SessionController],
  providers: [SessionService, ...sessionProviders],
})
export class SessionModule {}
