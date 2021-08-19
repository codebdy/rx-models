import { Injectable } from '@nestjs/common';
import { AliyunClient } from './aliyun/AliyunClient';

@Injectable()
export class StorageService {
  private storageClient = new AliyunClient();

  async checkAndCreateBacket(bucket: string) {
    return await this.storageClient.checkAndCreateBacket(bucket);
  }

  async putFileData(folder: string, name: string, data: any) {
    return await this.storageClient.putFileData(folder, name, data);
  }
}
