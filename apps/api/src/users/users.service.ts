import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { RolesService } from 'src/roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private rolesService: RolesService,
  ) {}

  async getAll() {
    return await this.userModel.find().exec();
  }

  async getOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (user) {
      await user.populate('roles');
      return user;
    }
    return null;
  }

  async create(body: User) {
    const createdUser = new this.userModel(body);
    return createdUser.save();
  }

  async createGlobalAdmin({ username, password }) {
    const globalAdminRole = await this.rolesService.findByName('GlobalAdmin');
    if (globalAdminRole) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const globalAdminUser = new this.userModel({
        username,
        password: hashedPassword,
        roles: [globalAdminRole._id],
      });
      return globalAdminUser.save();
    }
  }
}
