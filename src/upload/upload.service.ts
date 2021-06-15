import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  async saveThumbnail(file: any) {
    const thumbnailPath = `./public/thumbnails/${file.filename}`;
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      sharp(file.path)
        .resize(200, 200)
        .toFile(thumbnailPath, (err, info) => {
          console.debug('Resize Success', info);
          if (err) {
            console.error('Resize Error', err);
          }
        });
      console.debug('上传图像', file);
    }

    return thumbnailPath;
  }
}
