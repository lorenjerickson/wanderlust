import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Participant } from '@wanderlust/core';

type ParticipantType = typeof Participant;

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel('paticipant') private participantModel: Model<ParticipantType>,
  ) {}

  async getAll() {
    return await this.participantModel.find().exec();
  }

  async getOneByUsername(username: string) {
    return await this.participantModel.find({ username: username }).exec();
  }

  async getOneById(id: string) {
    return this.participantModel.findById(id).exec();
  }

  async create(body: ParticipantType) {
    const createdUser = new this.participantModel(body);
    return createdUser.save();
  }

  async update(id: string, body: ParticipantType) {
    const user = await this.getOneById(id);
    const updatedUser = new this.participantModel({ ...user, ...body });
    return updatedUser.save();
  }
}
