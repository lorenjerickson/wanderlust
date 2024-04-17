import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const audioSchema = new mongoose.Schema({
    audio: {
        data: Buffer,
        contentType: String
    }
});

const audioModel = mongoose.model("audio", audioSchema);

const audioStorage = multer.diskStorage({
    destination: './library/media/audio/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + ' - ' + Date.now() + path.extname(file.originalname))
    }
})

export { audioModel, audioStorage }
