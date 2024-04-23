import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [ImagesModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {

  constructor() { }

}
