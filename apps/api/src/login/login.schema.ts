import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Session {
    @Prop({ required: true })
    username: string;
    @Prop({ required: true })
    sessionid: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
