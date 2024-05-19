import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { UsersService } from 'src/users/users.service';

@Controller("api/login")
export class LoginController {
    constructor(private readonly loginService: LoginService, private readonly userService: UsersService) { }

    @Post()
    async login(@Body() body: { username: string, password: string }) {

        // const user = await this.userService.getOneByUsername(body.username);

        return await this.userService.create({...body});

        // return this.loginService.login({ user, credential: body });
    }
}
