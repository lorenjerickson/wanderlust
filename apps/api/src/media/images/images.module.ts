import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller.js';
import { ImagesService } from './images.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema, Image } from './schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
