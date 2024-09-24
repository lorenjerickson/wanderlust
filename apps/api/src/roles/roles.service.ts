import { Injectable } from '@nestjs/common';
import { Role } from './roles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async getAll() {
    return await this.roleModel.find().exec();
  }

  async create(body: Role) {
    const createdRole = new this.roleModel(body);
    return createdRole.save();
  }
}
