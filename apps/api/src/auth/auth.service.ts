import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'src/session/session.schema';
import { User } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async createUserToken({ user, session }: { user: User; session: Session }) {
    const payload = { username: user.username, sub: user, session };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async validateUserToken({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this.userService.getOneByUsername(username);
    if (user) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }
}
