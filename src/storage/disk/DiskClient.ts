import {
  DISK_STORAGE_PATH,
  DISK_STORAGE_PUBLIC_PATH,
  DISK_STORAGE_PUBLIC_URL_BASE,
  ImageSize,
} from 'src/util/consts';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { StorageClient } from '../storage.client';
import { dirname, parse, extname } from 'path';
import * as sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export class DiskClient implements StorageClient {
  private host: string;

  setHost(host: string) {
    this.host = host;
  }
  async checkAndCreateBucket(bucket: string) {
    const folderName = DISK_STORAGE_PATH + bucket;
    await this.checkAndCreateDir(folderName);
  }

  private async checkAndCreateDir(dir: string) {
    try {
      if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir, { recursive: true });
      }
    } catch (error) {
      throw error;
    }
  }

  async putFileData(name: string, data: any, bucket: string) {
    const fileName = DISK_STORAGE_PATH + bucket + '/' + name;
    await this.checkAndCreateDir(dirname(fileName));
    await PlatformTools.writeFile(fileName, data);
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    const fileName = DISK_STORAGE_PATH + bucket + '/' + name;
    await this.checkAndCreateDir(dirname(fileName));
    await PlatformTools.writeFile(fileName, file.buffer);
  }

  async resizeImage(path: string, bucket: string, size?: ImageSize) {
    const fileName = DISK_STORAGE_PATH + bucket + '/' + path;
    if (size) {
      path =
        parse(path)?.name + `-${size.width}x${size.height}` + extname(path);
    }

    const nameWithBucket = bucket + '/' + path;
    const publicStoragePath = DISK_STORAGE_PUBLIC_PATH + nameWithBucket;
    const publicFileUrl =
      this.host + DISK_STORAGE_PUBLIC_URL_BASE + nameWithBucket;

    await this.checkAndCreateDir(dirname(publicStoragePath));
    if (PlatformTools.fileExist(publicStoragePath)) {
      return publicFileUrl;
    }

    if (PlatformTools.fileExist(fileName)) {
      const extName = extname(fileName).replace('.', '').toLowerCase();
      if (
        extName === 'jpg' ||
        extName === 'jpeg' ||
        extName === 'png' ||
        extName === 'gif'
      ) {
        const srp = sharp(fileName);
        if (size) {
          srp.resize(size.width, size.height);
        }
        srp.toFile(publicStoragePath, (err, info) => {
          console.debug('Resize Success', info);
          if (err) {
            console.error('Resize Error', err);
          }
        });
        return publicFileUrl;
      }
    }
    return '';
  }

  async fileLocalPath(path: string, bucket: string) {
    const nameWithBucket = bucket + '/' + path;

    return DISK_STORAGE_PATH + nameWithBucket;
  }
}
