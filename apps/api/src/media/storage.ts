import mongoose from 'mongoose';
import { resolve, join } from 'path';
import { diskStorage } from 'multer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mediaSchema = new mongoose.Schema({
  media: {
    data: Buffer,
    contentType: String,
  },
});

const MediaModel = mongoose.model('media', mediaSchema);

const mediaStorage = diskStorage({
  destination: resolve(__dirname, join(__dirname, "..", "..", "..", "..", "storage", 'media')),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export { MediaModel, mediaStorage };
