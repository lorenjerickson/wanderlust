import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
    @Prop()
    id: string;
    
    @Prop()
    width: number;

    @Prop()
    height: number;

    @Prop()
    aspectRatio: number;

    @Prop()
    format: string;

    @Prop()
    resolution: string;

    @Prop()
    colorDepth: number;

    @Prop()
    compression: number;

    @Prop()
    quality: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
