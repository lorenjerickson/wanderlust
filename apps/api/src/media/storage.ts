import mongoose from 'mongoose';
import { resolve, join } from 'path';
import { diskStorage } from 'multer';

const mediaSchema = new mongoose.Schema({
  media: {
    data: Buffer,
    contentType: String,
  },
});

const MediaModel = mongoose.model('media', mediaSchema);

const mediaStorage = diskStorage({
  destination: resolve(__dirname, join('..', '..', 'static', 'media')),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export { MediaModel, mediaStorage };
