import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { databaseProviders } from './database/database.providers';
import { MediaModule } from './media/media.module';
import { ParticipantsModule } from './participants/participants.module';
import { SessionModule } from './session/session.module';
=======
import { LoginModule } from './login/login.module';
import { MediaModule } from './media/media.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
>>>>>>> cb21b1c (feat: auth with jwt)

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017?appName=wanderlust-api&directConnection=true',
      {
        dbName: 'wanderlust',
      },
    ),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, join('..')),
    }),
    MediaModule,
<<<<<<< HEAD
    ParticipantsModule,
    SessionModule,
=======
    UsersModule,
    LoginModule,
    RolesModule,
>>>>>>> cb21b1c (feat: auth with jwt)
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
