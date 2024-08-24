import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    const created = new this.userModel({
      username,
      password: await bcrypt.hash(password, 10),
      roles: ['Participant'],
    });
    return created.save();
  }

  async update(sessionId: string, body: User): Promise<User> {
    const { username, password, ...rest } = body;

    const userToBeUpdated = await this.findOneByUsername(username);
    if (userToBeUpdated) {
      const updatedUser = {
        ...userToBeUpdated,
        ...rest,
      };
      if (password) {
        updatedUser.password = await bcrypt.hash(password, 10);
      }
      return this.userModel.findOneAndUpdate({ sessionId }, updatedUser, {
        new: true,
      });
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async findAll() {
    return this.userModel.find();
  }
}
