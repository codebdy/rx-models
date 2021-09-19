import {
  DISK_STORAGE_PATH,
  DISK_STORAGE_PUBLIC_PATH,
  ImageSize,
} from 'src/util/consts';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { StorageClient } from '../storage.client';
import { dirname, basename, extname } from 'path';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export class DiskClient implements StorageClient {
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
    await this.checkAndCreateBucket(dirname(fileName));
    await PlatformTools.writeFile(fileName, data);
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    const fileName = DISK_STORAGE_PATH + bucket + '/' + name;
    await this.checkAndCreateBucket(dirname(fileName));
    await PlatformTools.writeFile(fileName, file.buffer);
  }

  async resizeImage(path: string, bucket: string, size?: ImageSize) {
    const fileName = DISK_STORAGE_PATH + bucket + '/' + path;
    const publicPath = DISK_STORAGE_PUBLIC_PATH + bucket;
    let publicFileName = publicPath + '/' + path;
    if (size) {
      publicFileName =
        publicPath +
        '/' +
        basename(path) +
        `${size.width}x${size.height}.` +
        extname(path);
    }
    await this.checkAndCreateDir(dirname(publicFileName));
    if (PlatformTools.fileExist(publicFileName)) {
      return publicFileName;
    }

    if (PlatformTools.fileExist(fileName)) {
      console.log('哈哈', fileName, bucket);
      if (extname(fileName).match(/\/(jpg|jpeg|png|gif)$/)) {
        const srp = sharp(fileName);
        if (size) {
          srp.resize(size.width, size.height);
        }
        srp.toFile(publicFileName, (err, info) => {
          console.debug('Resize Success', info);
          if (err) {
            console.error('Resize Error', err);
          }
        });
        return publicFileName;
      }
    }

    /*const client = new OSS(aliyunConfig);
    const urlInfo = urlCache.getUrlInfo(path, bucket, size);
    if (urlInfo) {
      return urlInfo.url;
    }
    client.useBucket(bucket);
    const url = await client.signatureUrl(path, {
      expires: expaireTime,
      method: 'GET',
      process: size
        ? `image/resize,w_${size.width},h_${size.height}`
        : undefined,
    });
    urlCache.addUrl({
      path: path,
      bucket: bucket,
      size: size,
      time: new Date(),
      url: url,
    });
    return url;*/
    return '';
  }
}
