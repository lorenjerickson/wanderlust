import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Session } from './session.schema.js';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @Inject('SESSION_MODEL')
    private sessionModel: Model<Session>,
  ) {}

  async create(username: string): Promise<Session> {
    const created = new this.sessionModel({
      username,
      startedAt: new Date(),
      touchedAt: new Date(),
      sessionId: randomUUID(),
    });
    return created.save();
  }

  async update(sessionId: string): Promise<Session> {
    return this.sessionModel.findOneAndUpdate(
      { sessionId },
      { touchedAt: new Date() },
      { new: true },
    );
  }
}
