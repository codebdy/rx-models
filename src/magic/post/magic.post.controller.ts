import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MagicPostService } from './magic.post.service';

@Controller()
export class MagicPostController {
  constructor(private readonly postService: MagicPostService) {}

  /**
   * 通用提交接口，语法示例：
   * {
   *    "RxApp":[
   *      {
   *        "id": 1,
   *        "name":"XXX",
   *        "auths":[
   *          {
   *            "id":2,
   *            "name":"xxx",
   *          },
   *          {
   *            "name":"xxx",
   *          },
   *          4,5,6
   *        ],
   *       "author":null,
   *      }
   *    ]
   * }
   * @returns
   */
  @Post('post')
  @UseInterceptors(FileInterceptor('file'))
  async postModels(@UploadedFile() file, @Body() body: any) {
    try {
      console.debug(body);
      return await this.postService.post(body || {}, file);
    } catch (error: any) {
      console.error('postModels error:', error);
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
