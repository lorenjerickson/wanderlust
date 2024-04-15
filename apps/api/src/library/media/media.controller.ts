import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller("library/media")
export class MediaController {
  constructor(private readonly appService: MediaService) { }
}
