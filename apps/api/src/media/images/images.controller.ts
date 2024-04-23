import { Controller, Get, Post, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Body, Put, Delete, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Image } from './schema';

@Controller("media/images")
export class ImagesController {
  constructor(private readonly imageService: ImagesService) { }

  @Get()
  getAll() {
    console.log('images controller');
    return this.imageService.findAll();
  }

  @Get(':id')
  getOne(id: string) {
    return this.imageService.findOne(id);
  }

  @Post()
  createImage(@Body() image: Image) {
    return this.imageService.createImage(image);
  }

  @Put(':id')
  updateImage(@Param() id: string, @Body() image: Image) {
    return this.imageService.updateImage(id, image);
  }

  @Delete(':id')
  deleteImage(id: string) {
    return this.imageService.deleteImage(id);
  }
}
