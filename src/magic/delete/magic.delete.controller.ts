import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { MagicDeleteService } from './magic.delete.service';

@Controller()
export class MagicPostController {
  constructor(private readonly deleteService: MagicDeleteService) {}

  /**
   * 通用提交接口，语法示例：
   * {
   *    "RxApp":[
   *      2,3,5,
   *      {
   *        "id": 1,
   *        "auths @relation(RxAuth)":[
   *          2,3,4,
   *          {
   *            id:9,
   *            xxxs:[...]
   *          }
   *        ]
   *      }
   *    ]
   * }
   * @returns
   */
  @Post('delete')
  async deleteModels(@Body() body: any) {
    try {
      console.debug(body);
      return await this.deleteService.delete(body || {});
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
