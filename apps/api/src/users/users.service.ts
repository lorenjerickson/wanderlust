import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAll() {
        return await this.userModel.find().exec();
    }

    async getOneByUsername(username: string) {
        return await this.userModel.find({ username: username }).exec();
    }

    async create(body: User) {
        const createdUser = new this.userModel(body);
        return createdUser.save();
    }
}
