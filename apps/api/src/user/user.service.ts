import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Role, User } from '@wanderlust/core';
import * as bcrypt from 'bcrypt';

type UserResponse = Omit<Partial<User>, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<UserResponse> {
    const { password } = user;
    user.password = await await bcrypt.hash(password, 10);
    const created = new this.userModel(user);
    const createdUser: UserResponse = await created.save();
    return createdUser;
  }

  async update(sessionId: string, body: User): Promise<UserResponse> {
    const userToBeUpdated = await this.findOneByUsername(body.emailAddress);
    if (userToBeUpdated) {
      const updatedUser = {
        ...userToBeUpdated,
        ...body,
      };
      const postUpdateUser: UserResponse =
        await this.userModel.findOneAndUpdate({ sessionId }, updatedUser, {
          new: true,
        });
      return postUpdateUser;
    } else {
      throw new Error('User not found');
    }
  }

  async findOneByUsername(emailAddress: string): Promise<User> {
    const foundUser = await this.userModel.findOne({
      emailAddress,
    });
    return foundUser;
  }

  async findAll() {
    const allUsers = await this.userModel.find();
    return allUsers.map((user) => ({ ...user, password: undefined }));
  }

  async findOneByRole(role: Role) {
    return await this.userModel.findOne({ roles: role });
  }
}
