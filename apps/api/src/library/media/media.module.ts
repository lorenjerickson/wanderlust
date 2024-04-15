import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {

  constructor() {}
}
