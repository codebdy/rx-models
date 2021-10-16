import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AliyunConfig } from 'src/entity-interface/AliyunConfig';
import { EntityRxConfig, RxConfig } from 'src/entity-interface/RxConfig';
import { RxStorageType } from 'src/entity-interface/RxStorageType';
import { RxBaseService } from 'src/rxbase/rxbase.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { CONFIG_KEY_STORAGE, FOLDER_UPLOADS, ImageSize } from 'src/util/consts';
import { AliyunClient } from './aliyun/AliyunClient';
import { DiskClient } from './disk/DiskClient';
import { StorageClient } from './storage.client';

type StorageConfig = { type: RxStorageType } & AliyunConfig;

@Injectable()
export class StorageService implements OnModuleInit {
  private inited = false;
  private storageClient: StorageClient;
  private storageType: RxStorageType = RxStorageType.Disk;
  constructor(
    @Inject(forwardRef(() => TypeOrmService))
    private readonly typeOrmService: TypeOrmService,
    private readonly baseService: RxBaseService,
  ) {
    this.storageClient = new DiskClient();
  }

  async onModuleInit() {
    if (!this.typeOrmService.connection) {
      this.inited = false;
      return;
    }
    this.inited = true;
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
    this.storageType = storageType;
    if (storageType === RxStorageType.Disk) {
      return;
    }

    if (storageType === RxStorageType.AliyunOSS) {
      this.storageClient = new AliyunClient(aliyunConfig);
    }
    console.debug('StorageService initializated');
  }

  async checkAndCreateBucket(bucket: string) {
    if (!this.inited) {
      await this.onModuleInit();
    }
    return await this.storageClient.checkAndCreateBucket(bucket);
  }

  async putFileData(name: string, data: any, bucket: string) {
    if (!this.inited) {
      await this.onModuleInit();
    }
    return await this.storageClient.putFileData(name, data, bucket);
  }

  async putFile(name: string, file: Express.Multer.File, bucket: string) {
    if (!this.inited) {
      await this.onModuleInit();
    }
    return await this.storageClient.putFile(name, file, bucket);
  }

  /*async getTokenObject() {
    return await this.storageClient.creatUploadsOperateToken();
  }*/

  async resizeImage(path: string, size?: ImageSize) {
    if (!this.inited) {
      await this.onModuleInit();
    }
    if (this.storageType === RxStorageType.Disk) {
      (this.storageClient as DiskClient).setHost(this.baseService.getHost());
    }
    return await this.storageClient.resizeImage(path, FOLDER_UPLOADS, size);
  }

  async fileUrlOrPath(path: string) {
    if (!this.inited) {
      await this.onModuleInit();
    }
    if (this.storageType === RxStorageType.Disk) {
      (this.storageClient as DiskClient).setHost(this.baseService.getHost());
    }
    return await this.storageClient.fileUrlOrPath(path, FOLDER_UPLOADS);
  }
}
