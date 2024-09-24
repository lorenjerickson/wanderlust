import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { diskStorage } from 'multer';
import { resolve, extname } from 'path';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ ref: 'roles' })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = mongoose.model(User.name, UserSchema);

export const avatarStorage = diskStorage({
  destination: resolve(__dirname, '../../static/media/images/avatars/'),
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});
