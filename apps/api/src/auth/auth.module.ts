import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config';

console.log(jwtConfig);

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '6h' },
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
