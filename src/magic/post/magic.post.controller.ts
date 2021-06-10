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
   *        "auths @relation":[// @add
   *          {
   *            "id":2,
   *          },
   *          {
   *            "id":3,
   *          }
   *        ]
   *      }
   *    ]
   * }
   * @returns
   */
  @Post('post')
  async postModels(@Body() body: any) {
    try {
      console.debug(body);
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
