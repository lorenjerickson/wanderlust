import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@wanderlust/core';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_MODEL')
    private roleModel: Model<Role>,
  ) {}

  async create(role: Role): Promise<Role> {
    const newRole = new this.roleModel(role);
    const createdRole: Role = await newRole.save();
    return createdRole;
  }

  async findOneByName(name: string): Promise<Role> {
    return await this.roleModel.findOne({
      name,
    });
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOrCreateAdminRole(): Promise<Role> {
    const adminRole = await this.findOneByName(Role.GlobalAdmin);
    if (adminRole) {
      return adminRole;
    } else {
      return this.create({
        name: Role.GlobalAdmin,
        description: 'Global Admin',
      });
    }
  }
}
