import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './roles.service';
import { UsersService } from 'src/users/users.service';

@Controller("api/roles")
export class RolesController {
    constructor(private readonly loginService: LoginService, private readonly userService: UsersService) { }

    @Post()
    async roles(@Body() body: { username: string, password: string }) {

        // const user = await this.userService.getOneByUsername(body.username);

        return await this.userService.create({ ...body });

        // return this.loginService.roles({ user, credential: body });
    }
}
