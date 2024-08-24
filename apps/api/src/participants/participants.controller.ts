import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from './participants.schema';
import { ParticipantsService } from './participants.service';

@Controller('api/users')
export class ParticipantsController {
  constructor(private readonly usersService: ParticipantsService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  getOne(id: string) {
    return this.usersService.getOneById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  createUser(@UploadedFile() file, @Body() body) {
    console.log('avatar', file);
    return this.usersService.create(body);
  }

  @Put(':id')
  updateUser(@Param() id: string, @Body() body) {
    return this.usersService.update(id, body);
  }
}
