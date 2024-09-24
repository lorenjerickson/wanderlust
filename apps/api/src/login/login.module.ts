import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { SessionModule } from 'src/session/session.module';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [UsersModule, SessionModule, RolesModule, AuthModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
