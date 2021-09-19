import { ImageSize } from 'src/util/consts';

export class DiskClient {
  async checkAndCreateBucket(bucket: string) {
    try {
      const client = new OSS(aliyunConfig);
      return await client.getBucketInfo(bucket);
    } catch (error) {
      // 指定的存储空间不存在。
      if (error.name === 'NoSuchBucketError' || error.code === 'NoSuchBucket') {
        return await this.createBucket(bucket);
      } else {
        throw error;
      }
    }
  }

  async createBucket(bucket: string) {
    const client = new OSS(aliyunConfig);
    const options = {
      storageClass: 'Standard', // 存储空间的默认存储类型为标准存储，即Standard。如果需要设置存储空间的存储类型为归档存储，请替换为Archive。
      acl: 'private', // 存储空间的默认读写权限为私有，即private。如果需要设置存储空间的读写权限为公共读，请替换为public-read。
      dataRedundancyType: 'LRS', // 存储空间的默认数据容灾类型为本地冗余存储，即LRS。如果需要设置数据容灾类型为同城冗余存储，请替换为ZRS。
    };
    // 填写Bucket名称。
    return await client.putBucket(bucket, options);
  }

  async putFileData(name: string, data: any, bucket: string) {
    const client = new OSS(aliyunConfig);
    client.useBucket(bucket);
    return await client.put(name, Buffer.from(data));
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    const client = new OSS(aliyunConfig);
    client.useBucket(bucket);
    return await client.put(name, file.buffer);
  }

  async resizeImage(path: string, bucket: string, size?: ImageSize) {
    const client = new OSS(aliyunConfig);
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
    return url;
  }
}
