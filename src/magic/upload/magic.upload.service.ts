import { Injectable } from '@nestjs/common';
//import * as sharp from 'sharp';
import { StorageService } from 'storage/storage.service';
import { FOLDER_UPLOADS } from 'util/consts';

@Injectable()
export class MagicUploadService {
  constructor(private readonly storageService: StorageService) {}

  async saveFile(file: Express.Multer.File, fileName: string) {
    await this.storageService.checkAndCreateBucket(FOLDER_UPLOADS);
    await this.storageService.putFile(fileName, file, FOLDER_UPLOADS);
  }

  /*async saveThumbnail(file: Express.Multer.File) {
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
  }*/
}
