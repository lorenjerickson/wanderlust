import * as mongoose from 'mongoose';

export interface Session {
  sessionId: string;
  username: string;
  startedAt: Date;
  touchedAt: Date;
}

export const SessionSchema = new mongoose.Schema({
  sessionId: String,
  username: String,
  startedAt: Date,
  touchedAt: Date,
});
