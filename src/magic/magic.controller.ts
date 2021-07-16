import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AbilityService } from 'src/magic/ability.service';
import { DeleteCommandService } from 'src/command/delete-command.service';
import { PostCommandService } from 'src/command/post-command.service';
import { QueryCommandService } from 'src/command/query-command.service';
import { QueryResult } from 'src/common/query-result';
import { SchemaService } from 'src/schema/schema.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { sleep } from 'src/util/sleep';
import { EntityManager } from 'typeorm';
import { MagicInstanceService } from './magic.instance.service';
import { RxUser } from 'src/entity-interface/rx-user';

@Controller()
export class MagicController {
  constructor(
    private readonly typeormSerivce: TypeOrmService,
    private readonly queryCommandService: QueryCommandService,
    private readonly postCommandService: PostCommandService,
    private readonly deleteCommandService: DeleteCommandService,
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
  async query(@Request() req, @Param('jsonStr') jsonStr: string) {
    try {
      console.debug('JSON QUERY String', jsonStr);
      await sleep(500);
      let result: QueryResult;
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
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
  async post(@Request() req, @Body() body: any) {
    try {
      await sleep(500);
      console.debug(body);
      let result: any;
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
          );
          result = await entityService.post(body || {});
        },
      );
      return result;
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

  /**
   * 通用删除接口，语法示例：
   * {
   *    "RxApp @cascade(pages, auths)":[2,3,5],
   *    "RxAuth":7
   * }
   * @returns
   */
  @Post('delete')
  async deleteModels(@Request() req, @Body() body: any) {
    try {
      await sleep(500);
      console.debug(body);
      let result: any;
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
          );
          result = await entityService.delete(body || {});
        },
      );
      return result;
    } catch (error: any) {
      console.error('deleteModels error:', error);
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
  async update(@Request() req, @Body() body: any) {
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

  private createEntityService(entityManger: EntityManager, user: RxUser) {
    return new MagicInstanceService(
      entityManger,
      new AbilityService(user, this.typeormSerivce, this.schemaService),
      this.queryCommandService,
      this.postCommandService,
      this.deleteCommandService,
      this.schemaService,
    );
  }
}
