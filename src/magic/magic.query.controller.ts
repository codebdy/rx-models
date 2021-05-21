import { Controller, Get, Param } from '@nestjs/common';
import { MagicQueryService } from './magic.query.service';

@Controller()
export class MagicQueryController {
  constructor(private readonly queryService: MagicQueryService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "User":{
   *      "id":1,
   *      "age @between":[18, 40],
   *      "where":{
   *        "name @like":"%风%",
   *        "orWhere":{
   *            "phone.type":"HUAWEI",
   *            "orWhere":{
   *              "cc":"XX",
   *            }
   *         },
   *         "where":{
   *           "email @notNull":true,
   *         }
   *      },
   *      "orWhere":{
   *      },
   *   }
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  //@UseGuards(AuthGuard())
  @Get('get/:json?')
  getModels(@Param('json') json) {
    return this.queryService.query(json);
  }
}
