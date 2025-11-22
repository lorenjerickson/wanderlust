import { Module } from '@nestjs/common';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { mediaProviders } from './media.providers.js';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController],
  providers: [MediaService, ...mediaProviders],
})
export class MediaModule {
  constructor() {}
}
