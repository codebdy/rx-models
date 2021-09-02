import { FOLDER_UPLOADS } from 'src/util/consts';
import { aliyunConfig, stsConfig } from './aliyun';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OSS = require('ali-oss');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { STS } = require('ali-oss');

const client = new OSS(aliyunConfig);

export class AliyunClient {
  async checkAndCreateBucket(bucket: string) {
    try {
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
    const options = {
      storageClass: 'Standard', // 存储空间的默认存储类型为标准存储，即Standard。如果需要设置存储空间的存储类型为归档存储，请替换为Archive。
      acl: 'private', // 存储空间的默认读写权限为私有，即private。如果需要设置存储空间的读写权限为公共读，请替换为public-read。
      dataRedundancyType: 'LRS', // 存储空间的默认数据容灾类型为本地冗余存储，即LRS。如果需要设置数据容灾类型为同城冗余存储，请替换为ZRS。
    };
    // 填写Bucket名称。
    return await client.putBucket(bucket, options);
  }

  async putFileData(name: string, data: any, bucket: string) {
    client.useBucket(bucket);
    return await client.put(name, Buffer.from(data));
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    client.useBucket(bucket);
    return await client.put(name, file.buffer);
  }

  //客户端上传OSS用的TOKEN，本方法暂时没用
  async creatUploadsOperateToken() {
    await this.checkAndCreateBucket(FOLDER_UPLOADS);
    const client = new STS({
      accessKeyId: aliyunConfig.accessKeyId,
      accessKeySecret: aliyunConfig.accessKeySecret,
    });

    const result = await client.assumeRole(
      stsConfig.roleArn,
      stsConfig.policy,
      stsConfig.tokenExpireTime,
    );
    return {
      AccessKeyId: result.credentials.AccessKeyId,
      AccessKeySecret: result.credentials.AccessKeySecret,
      SecurityToken: result.credentials.SecurityToken,
      Expiration: result.credentials.Expiration,
    };
  }
}
