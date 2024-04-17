import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const videoSchema = new mongoose.Schema({
    video: {
        data: Buffer,
        contentType: String
    }
});

const videoModel = mongoose.model("video", videoSchema);

const videoStorage = multer.diskStorage({
    destination: './library/media/video/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + ' - ' + Date.now() + path.extname(file.originalname))
    }
})

export { videoModel, videoStorage }
