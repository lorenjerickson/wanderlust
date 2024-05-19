import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
    imports: [UsersModule],
    controllers: [LoginController],
    providers: [LoginService],
})
export class LoginModule { }
