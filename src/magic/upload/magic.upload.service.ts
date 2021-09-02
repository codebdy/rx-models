import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { StorageService } from 'src/storage/storage.service';
import { FOLDER_UPLOADS } from 'src/util/consts';

@Injectable()
export class MagicUploadService {
  constructor(private readonly storageService: StorageService){}

  async saveFile(file: any, fileName: string) {
    await this.storageService.checkAndCreateBucket(FOLDER_UPLOADS);
    await this.storageService.putFileData(fileName, file, FOLDER_UPLOADS);
  }

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
