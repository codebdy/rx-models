import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { MagicTreeService } from './magic.tree.service';

@Controller()
export class MagicTreeController {
  constructor(private readonly treeService: MagicTreeService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "model":"RxMediaFolder
   *    "id":1,
   *    "select":["*", "photosCount"],
   *    "age @between":[18, 40], //@IN
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  //@UseGuards(AuthGuard())
  @Get('tree/:jsonStr?')
  async getModels(@Param('jsonStr') jsonStr) {
    try {
      console.debug('JSON TREE String', jsonStr);
      return await this.treeService.query(jsonStr);
    } catch (error: any) {
      console.error('get tree error:', error);
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
