import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { UserService } from '../user/user.service';

@Controller('api/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async login(@Body() body: { username: string; password: string }) {
    const found = await this.userService.findOneByUsername(body.username);
    if (found) {
      return await this.loginService.login({ user: found, credential: body });
    } else {
      throw new Error('User not found');
    }
  }
}
