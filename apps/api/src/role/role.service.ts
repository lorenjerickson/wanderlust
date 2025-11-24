import { Inject, Injectable } from '@nestjs/common';
import { Role, RoleName } from '@wanderlust/core';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_MODEL')
    private roleModel: Model<Role>,
  ) {}

  async create(role: Role): Promise<Role> {
    try {
      const newRole = new this.roleModel(role);
      const createdRole: Role = await newRole.save();
      return createdRole;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async findOneByName(role: RoleName): Promise<Role> {
    try {
      return await this.roleModel.findOne({ name: role });
    } catch (error) {
      console.error('Error finding role by name:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.roleModel.find();
    } catch (error) {
      console.error('Error finding all roles:', error);
      throw error;
    }
  }

  async findOrCreateAdminRole(): Promise<Role> {
    try {
      const adminRole = await this.findOneByName(RoleName.GlobalAdmin);
      if (adminRole) {
        return adminRole;
      } else {
        return this.create({
          name: RoleName.GlobalAdmin,
          description: 'Global Administrator with full access',
        });
      }
    } catch (error) {
      console.error('Error in findOrCreateAdminRole:', error);
      throw error;
    }
  }
}
