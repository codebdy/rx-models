import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MagicUploadService } from './magic.upload.service';

@Controller()
export class MagicUploadController {
  constructor(private readonly uploadService: MagicUploadService) {}

  /**
   * 通用提交接口，语法示例：
   * {
   *   "model":"RxMedia",
   *   "file":...
   *   "folder":1
   * }
   * @returns
   */
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async postModels(@UploadedFiles() files, @Body() body: any) {
    try {
      console.debug(files);
      console.debug(body);
      //return await this.uploadService.post(body || {});
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }
}
