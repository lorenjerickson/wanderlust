import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { avatarStorage } from './users.schema';
import { UsersService } from './users.service';

@Controller("api/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getAll() {
        return this.usersService.getAll();
    }

    @Get(':id')
    getOne(id: string) {
        return this.usersService.getOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { storage: avatarStorage }))
    createUser(@UploadedFile() file, @Body() body) {
        return this.usersService.create(body);
    }
}
