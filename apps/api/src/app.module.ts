import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database/database.providers';
import { MediaModule } from './media/media.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
