import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SessionModel } from './login.schema';

interface UserSession {
  username: string;
  sessionStart: Date;
  roles: string[];
}

@Injectable()
export class LoginService {
  async login({ user, credential }: { user: any; credential: any }) {
    const hashed = await bcrypt.hash(credential.password, 10);
    if (bcrypt.compare(hashed, user.password)) {
      const usrSession: UserSession = {
        username: user.username,
        sessionStart: new Date(),
        roles: user.roles,
      };

      const session = SessionModel.create(usrSession);
      return session;
    } else {
      throw new Error('Login failed');
    }
  }
}
