import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './roles.controller';
import { LoginService } from './roles.service';

@Module({
    imports: [UsersModule],
    controllers: [LoginController],
    providers: [LoginService],
})
export class RolesModule { }
