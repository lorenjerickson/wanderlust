import mongoose from 'mongoose';
const multer = require("multer");
import path from 'path';

const imageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    }
});

const imageModel = mongoose.model("image", imageSchema);

const imageStorage = multer.diskStorage({
    destination: './library/media/images/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

export { imageModel, imageStorage }
