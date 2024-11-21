import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { MediaService } from './media.service';

const storage = diskStorage({
  destination: resolve(__dirname, '../../static/media'),
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Get()
  // getAll() {
  //   return this.mediaService.getAll();
  // }

  @Get(':id')
  getOne(id: string) {
    return this.mediaService.getOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file) {
    console.log(file);
    return { message: 'File uploaded successfully!', file };
  }
}
