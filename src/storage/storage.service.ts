import { Injectable, OnModuleInit } from '@nestjs/common';
import { AliyunConfig } from 'src/entity-interface/AliyunConfig';
import { EntityRxConfig, RxConfig } from 'src/entity-interface/RxConfig';
import { RxStorageType } from 'src/entity-interface/RxStorageType';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { CONFIG_KEY_STORAGE, FOLDER_UPLOADS, ImageSize } from 'src/util/consts';
import { AliyunClient } from './aliyun/AliyunClient';
import { DiskClient } from './disk/DiskClient';
import { StorageClient } from './storage.client';

type StorageConfig = { type: RxStorageType } & AliyunConfig;

@Injectable()
export class StorageService implements OnModuleInit {
  constructor(private readonly typeOrmService: TypeOrmService) {}

  private storageClient: StorageClient = new DiskClient();

  async onModuleInit() {
    //await this.createConnection();
    const repository =
      this.typeOrmService.connection.getRepository<RxConfig>(EntityRxConfig);
    const rxConfig = await repository.findOne({
      name: CONFIG_KEY_STORAGE,
    });
    if (!rxConfig) {
      return;
    }
    const storageConfig = rxConfig.value as StorageConfig;
    const { type: storageType, ...aliyunConfig } = storageConfig || {};
    if (storageType === RxStorageType.Disk) {
      return;
    }

    if (storageType === RxStorageType.AliyunOSS) {
      this.storageClient = new AliyunClient(aliyunConfig);
    }
    console.debug('StorageService initializated');
  }

  async checkAndCreateBucket(bucket: string) {
    return await this.storageClient.checkAndCreateBucket(bucket);
  }

  async putFileData(name: string, data: any, bucket: string) {
    return await this.storageClient.putFileData(name, data, bucket);
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    return await this.storageClient.putFile(name, file, bucket);
  }

  /*async getTokenObject() {
    return await this.storageClient.creatUploadsOperateToken();
  }*/

  async resizeImage(path: string, size?: ImageSize) {
    return await this.storageClient.resizeImage(path, FOLDER_UPLOADS, size);
  }
}
