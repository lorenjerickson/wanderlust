import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
    @Prop({ required: true })
    name: string;
}

export const RolesSchema = SchemaFactory.createForClass(Role);
