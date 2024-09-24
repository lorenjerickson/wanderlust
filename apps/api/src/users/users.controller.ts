import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from './users.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  getOne(username: string) {
    return this.usersService.getOneByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: avatarStorage }))
  createUser(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.usersService.create(body);
  }
}
