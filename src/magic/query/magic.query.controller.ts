import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { MagicQueryService } from './magic.query.service';
import { sleep } from './sleep';
import SqlWhereParser from './SqlWhereParser';

@Controller()
export class MagicQueryController {
  constructor(private readonly queryService: MagicQueryService) {}

  /**
   * 通用查询接口，语法示例：
   * {
   *   "model":"User @count  @getOne",//@getMany, @sum(ddd) as xx, @skip(100), @take(10) @paginate(25,0)
   *    "id":1,
   *    "select":["*", "photosCount"],
   *    "age @between":[18, 40], //@IN
   *    "andGroup":{
   *      "name @like":"%风%",
   *      "orGroup":{
   *          "type":"HUAWEI",
   *          "andGroup":{
   *            "cc":"XX",
   *          }
   *       },
   *       "andGroup":{
   *         "email @notNull":true,
   *         "orGroup":{
   *            "xxx":"xxx"
   *          }
   *       }
   *    },
   *    #LargeRelation功能暂时不实现
   *    "roles @count @take(5, LargeRelation) @toUpercase(name)":{
   *      "active": true,
   *      "isRemoved": false,
   *      "orderBy":{"name":'ASC'},
   *    },
   *    "orderBy":{
   *      "name":"ASC",
   *      "xxx" : "DESC",
   *      "ddd" : "ASC"
   *    },
   *    select:["name", "nn"],
   * }
   * 关系嵌套：文章与图片
   * {
   *    "model":"Post",
   *    "images @relation(PostImage)":{
   *      "media @relation(Media)":{
   *      }
   *    }
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  //@UseGuards(AuthGuard())
  @Get('get/:jsonStr?')
  async getModels(@Param('jsonStr') jsonStr) {
    try {
      console.debug('JSON QUERY String', jsonStr);
      const sql = 'name = "Shaun Persad" AND age >= 27';
      const parser = new SqlWhereParser();
      const parsed = parser.parse(sql);
      console.log('哈哈', parsed);

      await sleep(500);
      return await this.queryService.query(jsonStr);
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
