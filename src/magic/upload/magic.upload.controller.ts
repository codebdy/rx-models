import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, fileFilter } from './file-upload.utils';
import { MagicUploadService } from './magic.upload.service';

@Controller()
export class MagicUploadController {
  constructor(private readonly uploadService: MagicUploadService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  async postWithUpload(@UploadedFiles() files, @Body() body: any) {
    try {
      for (const file of files) {
        console.debug(file);
      }
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

  /**
   * 通用提交接口，语法示例：
   * {
   *   "model":"RxMedia",
   *   "file":...
   *   "folder":1
   * }
   * @returns
   */
  /*@Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async postModels(@UploadedFile() file, @Body() body: any) {
    try {
      console.debug(file);
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
  }*/
}
