import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { MagicQueryService } from './magic.query.service';

@Controller()
export class MagicQueryController {
  constructor(private readonly queryService: MagicQueryService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "model":"User @count  @getOne",//@getMany, @sum(ddd) as xx, @skip(100), @take(10)
   *    "id":1,
   *    "select":["*", "photosCount"],
   *    "age @between":[18, 40], //@IN
   *    "roles.isRemoved": false,
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
   *    "andWhere":{
   *      "xxx":"xxx"
   *    },
   *    "roles @relationship @count @sum(ddd) as xx, @toUpcase(name)":{
   *      "active": true,
   *      "isRemoved": false,
   *    },
   *    "orderBy":{
   *      "name":"ASC",
   *      "xxx" : "DESC",
   *      "ddd" : "ASC"
   *    },
   *    except:["password"],
   *    select:["name", "nn"],
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
