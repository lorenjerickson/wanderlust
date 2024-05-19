import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserSessionModel } from './login.schema';

interface UserSession {
    username: string;
    sessionStart: Date;
    roles: string[];
}

@Injectable()
export class LoginService {
    login({ user, credential }: { user: any, credential: any }) {
        if (bcrypt.compare(bcrypt.hash(credential.password), user.password)) {
            const usrSession: UserSession = {
                username: user.username,
                sessionStart: new Date(),
                roles: user.roles,
            }

            const session = UserSessionModel.create(usrSession);
            return session;
        } else {
            throw new Error("Login failed")
        }
    }
}
