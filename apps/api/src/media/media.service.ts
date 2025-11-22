import { Inject, Injectable } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';
import { Media } from '@wanderlust/core';
import { Model } from 'mongoose';

@Injectable()
export class MediaService {
  constructor(
    @Inject('MEDIA_MODEL')
    private mediaModel: Model<Media>,
  ) {}

  async getAll() {
    return await this.mediaModel.find();
  }

  async getOne(id: string) {
    return await this.mediaModel.find({ id });
  }

  async create({ file, user }) {
    const media = {
      title: file.filename,
      description: '',
      url: file.path,
      tags: [],
      createdBy: user.id,
      updatedBy: user.id,
    };

    const newMedia = new this.mediaModel(media);
    return await newMedia.save();
  }

  async update({ id, file, user }) {}

  async delete({ id, user }) {}
}
