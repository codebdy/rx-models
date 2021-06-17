import { Body, Controller, HttpException, Post } from '@nestjs/common';
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
  async postModels(@Body() body: any) {
    try {
      console.debug('postModels', body);
      return await this.postService.post(body || {});
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
