import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AbilityService } from 'src/ability/ability.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { SchemaService } from 'src/schema/schema.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { sleep } from 'src/util/sleep';
import { EntityManager } from 'typeorm';
import { EntityService } from './entity.service';

@Controller()
export class MagicController {
  constructor(
    private readonly abilityService: AbilityService,
    private readonly typeormSerivce: TypeOrmService,
    private readonly commandService: QueryCommandService,
    private readonly schemaService: SchemaService,
  ) {}
  /**
   * 通用查询接口，语法示例：
   * {
   *   "entity @count @getOne":"User",//@getMany, @sum(ddd) as xx, @skip(100), @take(10) @paginate(25,0)
   *    "id":1,
   *    "select":["*", "photosCount"],
   *    "age @between":[18, 40], //@IN
   *    "where":"name @like:'%风%' and id<>'5' or ('xx'=6 and 'tt'=7)"
   *    #LargeRelation功能暂时不实现
   *    "roles @count @take(5, LargeRelation) @toUpercase(name)":{
   *      "active": true,
   *      "isRemoved": false,
   *      "orderBy":{"name":'ASC'},
   *      "on":"name @like:'%风%' and id<>'5' or ('xx'=6 and 'tt'=7)"
   *    },
   *    "orderBy":{
   *      "name":"ASC",
   *      "xxx" : "DESC",
   *      "ddd" : "ASC"
   *    },
   *    select:["name", "nn"],
   *    "@count":true,
   *    "@sum":"price",
   *    "@tree":true
   * }
   * {
   *   "entity @sum(price) @count @tree":"Order"
   * }
   * {
   *    "entity":"Order",
   *    "@count":true,
   *    "@commands":{
   *      "sum":"price",
   *      "tree":true
   *    }
   * }
   * 关系嵌套：文章与图片
   * {
   *    "entity":"Post",
   *    "images":{
   *      "media":{
   *      }
   *    }
   * }
   * @param json JSON格式的查询条件
   * @returns 查询结果
   */
  @UseGuards(AuthGuard())
  @Get('get/:jsonStr?')
  async getEntities(@Param('jsonStr') jsonStr) {
    try {
      console.debug('JSON QUERY String', jsonStr);
      await sleep(500);
      let result;
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = new EntityService(
            entityManger,
            this.abilityService,
            this.commandService,
            this.schemaService,
          );
          result = await entityService.query(JSON.parse(jsonStr || '{}'));
        },
      );
      return result;
    } catch (error: any) {
      console.error('getEntities error:', error);
      throw new HttpException(
        {
          status: 500,
          error: error.message,
        },
        500,
      );
    }
  }

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
      //return await this.updateService.update(body || {});
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
