import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileName, fileFilter } from './file-upload.utils';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: fileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadMedia(@UploadedFile() file, @Body() body: any) {
    try {
      this.uploadService.saveThumbnail(file);
      const fileInfo = {} as any;
      fileInfo.originalname = file.originalname;
      fileInfo.filename = file.filename;
      fileInfo.mimetype = file.mimetype;
      fileInfo.path = file.path;
      fileInfo.size = file.size;
      body[file.fieldname] = fileInfo;

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
