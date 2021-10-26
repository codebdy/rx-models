import { ImageSize } from 'src/util/consts';

export interface StorageClient {
  checkAndCreateBucket(bucket: string): Promise<void>;

  putFileData(name: string, data: any, bucket: string): Promise<void>;

  putFile(
    name: string,
    file: Express.Multer.File,
    bucket: string,
  ): Promise<void>;

  resizeImage(path: string, bucket: string, size?: ImageSize): Promise<string>;

  fileLocalPath(path: string, bucket: string): Promise<string>;

  fileUrl(path: string, bucket: string): Promise<string>;
}
