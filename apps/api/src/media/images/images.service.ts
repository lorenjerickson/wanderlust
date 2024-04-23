import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './schema';

@Injectable()
export class ImagesService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) { }

  async findAll() {
    console.log('images service');
    return this.imageModel.find().exec();
  }

  async findOne(id: string) {
    return this.imageModel.find({ id }).exec();
  }

  async createImage(props: Image) {
    const image = new this.imageModel({
      ...props
    });

    return await image.save();
  }

  async updateImage(id: string, props: Image) {
    const original = await this.findOne(id);

    const image = new this.imageModel({
      ...original,
      ...props
    });

    return await image.save();
  }

  deleteImage(id: string) {
    return this.imageModel.deleteOne({ id }).exec();
  }
}
