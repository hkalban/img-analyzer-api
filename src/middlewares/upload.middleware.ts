import { gcpConfig } from '@/interfaces/gcp.interface';
import config from 'config';
import multer from 'multer';
import path from 'path';
const multerGCP = require('multer-google-storage');

const { keyFilename, bucket, projectId }: gcpConfig = config.get('googleCloud');

const uploadMaxSize = 2 * 1024 * 1024;

// Configure Google Cloud File Storage
const storage = multerGCP.storageEngine({
  autoRetry: true,
  bucket,
  projectId,
  keyFilename,
  filename: (req, file, cb) => {
    cb(null, `projectimages/${Date.now()}_${file.originalname}`);
  },
});

// // Configure Local File Storage
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/app/media/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

const uploadFileMiddleware = multer({
  storage: storage,
  limits: { fileSize: uploadMaxSize },
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
});

export default uploadFileMiddleware;
