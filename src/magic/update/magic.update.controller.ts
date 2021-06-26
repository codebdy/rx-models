import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { sleep } from '../../util/sleep';
import { MagicUpdateService } from './magic.update.service';

@Controller()
export class MagicUpdateController {
  constructor(private readonly updateService: MagicUpdateService) {}

  /**
   * 更新接口，批量更新某几个字段，语法示例：
   * {
   *    "RxApp":{
   *      "name":"xx",
   *      "email":"yy",
   *      "ids":[2,3,5]
   *    },
   *    "RxAuth":{
   *      ...
   *    }
   * }
   * @returns
   */
  @Post('update')
  async updateModels(@Body() body: any) {
    try {
      await sleep(500);
      console.debug(body);
      return await this.updateService.update(body || {});
    } catch (error: any) {
      console.error('updateModels error:', error);
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
