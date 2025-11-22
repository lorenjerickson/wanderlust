import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject, UseGuards } from '@nestjs/common';
import { Role, RoleName, User } from '@wanderlust/core';
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
    user.password = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...user,
      // revisions: {
      //   createdOn: new Date(),
      //   createdBy: 'system',
      //   updatedOn: new Date(),
      //   updatedBy: 'system',
      // },
      // access: {
      //   lastActive: new Date(),
      //   active: true,
      //   isBanned: false,
      //   isSuspended: false,
      //   isApproved: false,
      //   lastOnline: new Date(),
      // },
      // social: {
      //   discord: '',
      //   twitter: '',
      //   instagram: '',
      //   facebook: '',
      // },
    });
    const createdUser: UserResponse = await newUser.save();
    return createdUser;
  }

  async update(sessionId: string, body: User): Promise<UserResponse> {
    const userToBeUpdated = await this.findOneByUsername(body.emailAddress);
    if (userToBeUpdated) {
      const updatedUser = {
        ...userToBeUpdated,
        ...body,
      };
      const postUpdateUser: UserResponse = await this.userModel
        .findOneAndUpdate({ sessionId }, updatedUser, {
          new: true,
        })
        .populate('roles');
      return postUpdateUser;
    } else {
      throw new Error('User not found');
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const foundUser = await this.userModel
      .findOne({
        username,
      })
      .populate('roles');
    return foundUser;
  }

  async findAll() {
    const allUsers = await this.userModel
      .find()
      .populate('roles')
      .lean()
      .exec();

    return allUsers.map((user) => ({ ...user, password: undefined }));
  }

  async findOneByRole(role: Role) {
    const { password, ...user } = await this.userModel
      .findOne()
      .populate({
        path: 'roles',
        match: { name: role.name },
      })
      .lean()
      .exec();

    return user;
  }
}
