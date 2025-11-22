import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UserService } from '../user/user.service.js';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async post(@Body() body) {
    const { username, password } = body;
    return this.authService.authenticate({ username, password });
  }
}
