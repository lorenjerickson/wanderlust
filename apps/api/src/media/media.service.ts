import { Injectable } from '@nestjs/common';
import { MediaModel } from './storage';

@Injectable()
export class MediaService {


    // async getAll() {
    //     return await MediaModel.find();
    // }

    async getOne(id: string) {
        return await MediaModel.find({ id });
    }
}