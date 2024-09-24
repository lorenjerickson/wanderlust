import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginService } from './login.service';

@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() body: { username: string; password: string }) {
    return this.loginService.login(body);
  }
}
