import { Inject, Injectable } from '@nestjs/common';
import { Role, RoleName } from '@wanderlust/core';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_MODEL')
    private roleModel: Model<Role>,
  ) {}

  async create(role: RoleName): Promise<Role> {
    const newRole = new this.roleModel(role);
    const createdRole: Role = await newRole.save();
    return createdRole;
  }

  async findOneByName(role: RoleName): Promise<Role> {
    return await this.roleModel.findOne({ name: role });
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOrCreateAdminRole(): Promise<Role> {
    const adminRole = await this.findOneByName(RoleName.GlobalAdmin);
    if (adminRole) {
      return adminRole;
    } else {
      return this.create(RoleName.GlobalAdmin);
    }
  }
}
