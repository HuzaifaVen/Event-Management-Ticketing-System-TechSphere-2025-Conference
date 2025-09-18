// src/common/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export function createMulterOptions(destinationPath: string) {
  return {
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    storage: diskStorage({
      destination: join(process.cwd(), destinationPath),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  };
}
