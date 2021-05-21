import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { MagicQueryService } from './magic.query.service';

@Controller()
export class MagicQueryController {
  constructor(private readonly queryService: MagicQueryService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "model":"User @count  @getOne",//@getMany @sum(ddd) as xx
   *    "id":1,
   *    "select":["*", "photosCount"]
   *    "age @between":[18, 40],
   *    "where":{
   *      "name @like":"%风%",
   *      "orWhere":{
   *          "phone.type":"HUAWEI",
   *          "orWhere":{
   *            "cc":"XX",
   *          }
   *       },
   *       "where":{
   *         "email @notNull":true,
   *       }
   *    },
   *    "roles @relationship @count @sum(ddd) as xx":{
   *      "select": ['name @toUpcase', 'id'],
   *      "active": true,
   *    },
   *    "orWhere":{
   *    },
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  //@UseGuards(AuthGuard())
  @Get('get/:json?')
  async getModels(@Param('json') json) {
    try {
      return await this.queryService.query(JSON.parse(json || '{}'));
    } catch (error: any) {
      console.error('getModels error:', error);
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
