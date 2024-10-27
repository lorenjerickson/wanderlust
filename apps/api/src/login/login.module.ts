import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [UsersModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
