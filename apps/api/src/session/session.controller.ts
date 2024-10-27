import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Controller('api/session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createSession(@Body() body) {
    const user = await this.userService.findOneByUsername(body.username);
    if (user) {
      const match = await bcrypt.compare(body.password, user.password);
      if (!match) {
        console.error('Password mismatch', body.username);
        throw new Error('Login failed.');
      } else {
        return this.sessionService.create(user.emailAddress);
      }
    } else {
      console.error('User not found', body.username);
      throw new Error('Login failed.');
    }
  }
}
