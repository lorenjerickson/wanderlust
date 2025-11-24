import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject, UseGuards } from '@nestjs/common';
import { Role, RoleName, User } from '@wanderlust/core';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async create(user: Partial<User>): Promise<User> {
    try {
      const { password } = user;
      user.password = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        ...user,
      });
      const createdUser: User = await newUser.save();
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(sessionId: string, body: User): Promise<User> {
    try {
      const userToBeUpdated = await this.findOneByUsername(body.emailAddress);
      if (userToBeUpdated) {
        const updatedUser = {
          ...userToBeUpdated,
          ...body,
        };
        const postUpdateUser: User = await this.userModel
          .findOneAndUpdate({ sessionId }, updatedUser, {
            new: true,
          })
          .populate('roles');
        return postUpdateUser;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const foundUser = await this.userModel
        .findOne({
          username,
        })
        .populate('roles');
      return foundUser;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const allUsers = await this.userModel
        .find()
        .populate('roles')
        .lean()
        .exec();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  async findOneByRole(role: Role) {
    try {
      const user = await this.userModel
        .findOne()
        .populate({
          path: 'roles',
          match: { name: role.name },
        })
        .lean()
        .exec();

      if (user && user.roles && user.roles.length > 0) {
        user.password = undefined;
      } else {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error finding user by role:', error);
      throw error;
    }
  }
}
