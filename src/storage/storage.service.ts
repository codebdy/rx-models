import { Injectable } from '@nestjs/common';
import { EntityRxMedia, RxMedia } from 'src/entity-interface/RxMedia';
import { RxMediaType } from 'src/entity-interface/RxMediaType';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { FOLDER_UPLOADS } from 'src/util/consts';
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

  async getImage(path: string, size: string) {
    const images: RxMedia[] = await this.typeOrmService
      .getRepository<RxMedia>(EntityRxMedia)
      .find({ path: path });

    const image = images[0];
    if (!image) {
      throw new Error('Image not found!');
    }

    if (image.mediaType !== RxMediaType.IMAGE) {
      throw new Error('File is not image!');
    }

    const result = await this.storageClient.getFilePath(
      image.path,
      FOLDER_UPLOADS,
    );

    console.log(result);
    return result;
  }
}
