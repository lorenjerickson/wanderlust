import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { dirname, extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { MediaService } from './media.service.js';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard.js';
import { AdministratorGuard } from '../common/guards/administrator.guard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getOne(id: string) {
    return this.mediaService.getOne(id);
  }

  @UseGuards(AuthenticatedGuard)
  @UseGuards(AdministratorGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@Request() req, @UploadedFile() file) {
    this.mediaService.create({ file, user: req.user });
    return { message: 'File uploaded successfully!', file };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('upload/character')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadCharacter(@Request() req, @UploadedFile() file) {
    this.mediaService.create({ file, user: req.user });
    return { message: 'File uploaded successfully!', file };
  }
}
