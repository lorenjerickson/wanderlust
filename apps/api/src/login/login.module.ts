import { Module } from '@nestjs/common';
import { ParticipantsModule } from '../participants/participants.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [ParticipantsModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
