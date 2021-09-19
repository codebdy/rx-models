import { DISK_STORAGE_PATH, ImageSize } from 'src/util/consts';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export class DiskClient {
  async checkAndCreateBucket(bucket: string) {
    const folderName = DISK_STORAGE_PATH + bucket;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (error) {
      throw error;
    }
  }

  async putFileData(name: string, data: any, bucket: string) {
    await this.checkAndCreateBucket(bucket);
    //const client = new OSS(aliyunConfig);
    //client.useBucket(bucket);
    //return await client.put(name, Buffer.from(data));
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    await this.checkAndCreateBucket(bucket);
    //const client = new OSS(aliyunConfig);
    //client.useBucket(bucket);
    //return await client.put(name, file.buffer);
  }

  async resizeImage(path: string, bucket: string, size?: ImageSize) {
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
  }
}
