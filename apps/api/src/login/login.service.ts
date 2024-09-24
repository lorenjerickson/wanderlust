import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/roles/roles.schema';
import { SessionModel } from 'src/session/session.schema';
import { SessionService } from 'src/session/session.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  async login({ username, password }: { username: string; password: any }) {
    const user = await this.userService.getOneByUsername(username);
    if (user) {
      const matches = bcrypt.compareSync(password, user.password);
      if (matches) {
        const session = await this.sessionService.create(user._id.toString());
        if (session) {
          const token = await this.authService.createUserToken({
            user,
            session,
          });
          return { accessToken: token };
        }
      }
    }

    // await this.userService.createGlobalAdmin({ username, password });
    throw new Error('login Failed');
  }

  async logout({ user }) {
    const session = await SessionModel.findOne({ username: user.username });
    if (session) {
      await SessionModel.deleteOne({ username: user.username }).exec();
    }
  }
}
