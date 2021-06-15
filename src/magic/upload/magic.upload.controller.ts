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
import { MagicPostService } from 'src/magic/post/magic.post.service';
import { fileName, fileFilter } from './file-upload.utils';
import { MagicUploadService } from './magic.upload.service';

@Controller()
export class MagicUploadController {
  constructor(
    private readonly uploadService: MagicUploadService,
    private readonly postService: MagicPostService,
  ) {}

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

      const { model: modelName, ...modelData } = body;
      modelData.filenNme = file.filename;
      modelData.mimetype = file.mimetype;
      modelData.path = file.path;
      modelData.size = file.size;

      console.debug(modelData);
      return await this.postService.post({ [modelName]: modelData });
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
