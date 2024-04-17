import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from './library/media/media.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/wanderlust'), MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
