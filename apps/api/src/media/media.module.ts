import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module.js';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';

@Module({
  imports: [ImagesModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {
  constructor() {}
}
