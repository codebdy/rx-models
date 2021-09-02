import { Injectable } from '@nestjs/common';
import { AliyunClient } from './aliyun/AliyunClient';

@Injectable()
export class StorageService {
  private storageClient = new AliyunClient();

  async checkAndCreateBucket(bucket: string) {
    return await this.storageClient.checkAndCreateBucket(bucket);
  }

  async putFileData(name: string, data: any, bucket: string) {
    return await this.storageClient.putFileData(name, data, bucket);
  }

  async getTokenObject() {
    return await this.storageClient.creatUploadsOperateToken();
  }
}
