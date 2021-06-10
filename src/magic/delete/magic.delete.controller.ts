import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { MagicDeleteService } from './magic.delete.service';

@Controller()
export class MagicDeleteController {
  constructor(private readonly deleteService: MagicDeleteService) {}

  /**
   * 通用删除接口，语法示例：
   * {
   *    "RxApp @cascade(pages, auths)":[2,3,5],
   *    "RxAuth":7
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
