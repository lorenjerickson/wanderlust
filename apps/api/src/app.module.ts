import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { databaseProviders } from './database/database.providers.js';
import { MediaModule } from './media/media.module.js';
import { SessionModule } from './session/session.module.js';
import { UsersModule } from './user/user.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { RoleModule } from './role/role.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/wanderlust'),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, join('..')),
    }),
    MediaModule,
    UsersModule,
    SessionModule,
    SettingsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
