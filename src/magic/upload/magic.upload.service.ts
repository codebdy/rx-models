import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class MagicUploadService {
  async saveThumbnail(file: any) {
    const thumbnail = `/thumbnails/${file.filename}`;
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      sharp(file.path)
        .resize(200, 200)
        .toFile('./public' + thumbnail, (err, info) => {
          console.debug('Resize Success', info);
          if (err) {
            console.error('Resize Error', err);
          }
        });
    }

    return thumbnail;
  }
}
