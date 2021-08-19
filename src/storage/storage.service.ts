import { Injectable } from '@nestjs/common';
import { AliyunClient } from './aliyun/AliyunClient';

@Injectable()
export class StorageService {
  private storageClient = new AliyunClient();

  async checkAndCreateBacket(bucket: string) {
    return await this.storageClient.checkAndCreateBacket(bucket);
  }

  async putFileData(name: string, data: any, bucket: string) {
    return await this.storageClient.putFileData(name, data, bucket);
  }
}
