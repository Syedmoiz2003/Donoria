import multer from 'multer';
import path from 'path';
import config from '../config/index.js';

// Use memory storage so we can upload the buffer directly to Supabase
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs and Word docs are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter,
});

export const uploadSingle = upload.single('document');
export const uploadMultiple = upload.array('documents', 5);
