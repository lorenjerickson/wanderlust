import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants.js';
import { DatabaseModule } from '../database/database.module.js';
import { UsersModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { sessionProviders } from './auth.providers.js';
import { AuthService } from './auth.service.js';

console.log("JWT_SECRET", JWT_SECRET);  

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      // TODO fix this
      secret: '86C7D0E3-15CB-4395-B686-75B884F66B30::CA99AD57-54DA-4E3B-815E-5DD94600EE10',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...sessionProviders],
})
export class AuthModule {}
