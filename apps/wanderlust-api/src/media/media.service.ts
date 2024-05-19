import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  post(): string {
    return 'Hello World!';
  }
}
