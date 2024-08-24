import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Session {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  sessionid: string;
  @Prop({ required: true })
  startedAt: string;
  @Prop({ required: true })
  lastTouchedAt: string;
}

export const sessionSchema = SchemaFactory.createForClass(Session);

export const SessionModel = mongoose.model('session', sessionSchema);
