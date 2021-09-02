import { Injectable } from '@nestjs/common';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { FOLDER_UPLOADS, ImageSize } from 'src/util/consts';
import { AliyunClient } from './aliyun/AliyunClient';

@Injectable()
export class StorageService {
  constructor(private readonly typeOrmService: TypeOrmService) {}

  private storageClient = new AliyunClient();

  async checkAndCreateBucket(bucket: string) {
    return await this.storageClient.checkAndCreateBucket(bucket);
  }

  async putFileData(name: string, data: any, bucket: string) {
    return await this.storageClient.putFileData(name, data, bucket);
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    return await this.storageClient.putFile(name, file, bucket);
  }

  async getTokenObject() {
    return await this.storageClient.creatUploadsOperateToken();
  }

  async resizeImage(path: string, size: ImageSize) {
    return await this.storageClient.resizeImage(path, FOLDER_UPLOADS, size);
  }
}
