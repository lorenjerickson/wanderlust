import { Model } from 'mongoose';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Auth } from './auth.schema.js';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MODEL')
    private authModel: Model<Auth>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async authenticate({ username, password }): Promise<Auth> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.error('Password mismatch', username);
        throw new UnauthorizedException();
      } else {
        const payload = { sub: user.username, user };
        const jwt = await this.jwtService.signAsync(payload);
        return this.authModel.create({ username, jwt });
      }
    } else {
      console.error('User not found', username);
      throw new UnauthorizedException();
    }
  }

  async deauthenticate(username: string): Promise<Auth> {
    return this.authModel.findOneAndDelete({ username });
  }
}
