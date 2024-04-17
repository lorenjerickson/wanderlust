import { Controller, Get, Post, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { imageModel } from './storage';
import path from 'path';
import fs from 'fs';

@Controller("library/media/images")
export class ImagesController {
  constructor(private readonly appService: ImagesService) { }

  @Post("upload")
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000 }),
      new FileTypeValidator({ fileType: 'image/*' }),
    ]
  })) file: Express.Multer.File) {
    const img = new imageModel({
      image: {
        data: fs.readFileSync(path.join('./library/uploads/images/' + file.filename)),
        contentType: file.mimetype
      }
    })

    const document = await img.save();
  }
}
