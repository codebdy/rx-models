import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { sleep } from '../../util/sleep';
import { MagicPostService } from './magic.post.service';

@Controller()
export class MagicPostController {
  constructor(private readonly postService: MagicPostService) {}

  /**
   * 通用提交接口，语法示例：
   * {
   *    "RxApp @ignoreEmperty(password) @sendEmail(title, content, attachments, template, sign)":[
   *      {
   *        "id": 1,
   *        "name":"XXX",
   *        "auths @ignoreEmperty(password) @cascade":[
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
      await sleep(500);
      //console.debug('postModels', body);
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
