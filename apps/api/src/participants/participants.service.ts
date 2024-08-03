import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Participant } from './participants.schema';
import { Participant } from '@wanderlust/core';

@Injectable()
export class ParticipantsService {
  constructor(@InjectModel('Participant') private model: Model<Participant>) {}

  async getAll() {
    return await this.model.find().exec();
  }

  async create(body: Participant) {
    const createdParticipant = new this.model(body);
    return createdParticipant.save();
  }
}
