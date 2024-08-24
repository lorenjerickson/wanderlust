import { Body, Controller, Post } from '@nestjs/common';
import { ParticipantsService } from 'src/participants/participants.service';
import { LoginService } from './login.service';

@Controller('api/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userService: ParticipantsService,
  ) {}

  @Post()
  async login(@Body() body: { username: string; password: string }) {
    const found = await this.userService.getOneByUsername(body.username);
    if (found) {
      return await this.loginService.login({ user: found, credential: body });
    } else {
      throw new Error('User not found');
    }
  }
}
