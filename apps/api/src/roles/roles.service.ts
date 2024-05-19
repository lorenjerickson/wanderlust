import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './roles.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(Role.name) private roleModel: Model<Role>) { }

    async getAll() {
        return await this.roleModel.find().exec();
    }

    async create(body: Role) {
        const createdRole = new this.roleModel(body);
        return createdRole.save();
    }
}
