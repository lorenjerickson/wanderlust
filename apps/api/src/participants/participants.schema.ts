import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Participant {
  @Prop({ required: true })
  name: string;
}

export const ParticipantsSchema = SchemaFactory.createForClass(Participant);
