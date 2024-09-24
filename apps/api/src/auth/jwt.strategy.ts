import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SuperSecretJWTKey',
    });
  }

  async validateUser(payload: any, done: Function) {
    const user = await this.authService.validateUserToken(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
