import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AbilityService } from 'src/magic/ability.service';
import { DeleteDirectiveService } from 'src/directive/delete-directive.service';
import { PostDirectiveService } from 'src/directive/post-directive.service';
import { QueryDirectiveService } from 'src/directive/query-directive.service';
import { QueryResult } from 'src/magic-meta/query/query-result';
import { SchemaService } from 'src/schema/schema.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { sleep } from 'src/util/sleep';
import { EntityManager } from 'typeorm';
import { MagicInstanceService } from './magic.instance.service';
import { RxUser } from 'src/entity-interface/RxUser';
import { MagicUploadService } from './upload/magic.upload.service';
import { getFileName, getFileType } from './upload/file-upload.utils';
import { RxMedia } from 'src/entity-interface/RxMedia';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { RxBaseService } from 'src/rxbase/rxbase.service';
import { MailerSendService } from 'src/mailer/send/mailer.send.service';
import { TOKEN_DELETE, TOKEN_UPDATE } from './base/tokens';
import { RxEventGateway } from 'src/rx-event/rx-event.gateway';

@Controller()
export class MagicController {
  constructor(
    private readonly typeormSerivce: TypeOrmService,
    private readonly queryDirectiveService: QueryDirectiveService,
    private readonly postDirectiveService: PostDirectiveService,
    private readonly deleteDirectiveService: DeleteDirectiveService,
    private readonly schemaService: SchemaService,
    private readonly uploadService: MagicUploadService,
    protected readonly storageService: StorageService,
    private readonly baseService: RxBaseService,
    protected readonly mailerSendService: MailerSendService,
    protected readonly rxEventGateway: RxEventGateway,
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
   *    "@directives":{
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
      this.baseService.setHost('//' + req.headers.host);
      await sleep(500);
      let result: QueryResult;
      console.time(jsonStr);
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
          );
          result = await entityService.query(JSON.parse(jsonStr || '{}'));
        },
      );
      console.timeEnd(jsonStr);
      return result;
    } catch (error: any) {
      console.error('getEntities error', error);
      console.debug('出错JSON:', jsonStr);
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
   *    ],
   *    "@update":...,
   *    "@delete":...,
   * }
   * @returns
   */
  @UseGuards(AuthGuard())
  @Post('post')
  async post(@Request() req, @Body() body: any) {
    try {
      await sleep(500);
      console.debug('Post JSON', body);
      let result: any;
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
          );
          //处理穿越的update跟delete
          const postJSJON = {} as any;
          let updateJson: any;
          let deleteJson: any;
          for (const key in body || {}) {
            if (key.trim().startsWith('@')) {
              const actionName = key.replace('@', '').trim();
              if (actionName === TOKEN_UPDATE) {
                updateJson = body[key];
              } else if (actionName === TOKEN_DELETE) {
                deleteJson = body[key];
              } else {
                throw new Error('Not find cross action at root');
              }
            } else {
              postJSJON[key] = body[key];
            }
          }
          result = await entityService.post(postJSJON);

          if (updateJson) {
            result['@' + TOKEN_UPDATE] = await entityService.update(updateJson);
          }

          if (deleteJson) {
            result['@' + TOKEN_DELETE] = await entityService.delete(deleteJson);
          }
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
   *    "RxApp @cascade(pages, auths) @soft":[2,3,5],
   *    "RxAuth":7
   * }
   * @returns
   */
  @UseGuards(AuthGuard())
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
   *      "ids":[2,3,5],
   *      "where":...
   *    },
   *    "RxAuth":{
   *      ...
   *    }
   * }
   * @returns
   */
  @UseGuards(AuthGuard())
  @Post('update')
  async update(@Request() req, @Body() body: any) {
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
          result = await entityService.update(body || {});
        },
      );
      return result;
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

  /**
   * 通用上传，语法示例：
   * {
   *   "entity":"RxMedia",
   *   "file":...
   *   "folder":1
   * }
   * @returns
   */
  @UseGuards(AuthGuard())
  @Post('upload')
  /*@UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: fileName,
      }),
      fileFilter: fileFilter,
    }),
  )*/
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    try {
      await sleep(500);
      let result: any;
      if (!file) {
        throw new Error('no file to upload!');
      }
      await this.typeormSerivce.connection.transaction(
        async (entityManger: EntityManager) => {
          const entityService = this.createEntityService(
            entityManger,
            req.user,
          );
          const fileName = getFileName(file);
          await this.uploadService.saveFile(file, fileName);
          //this.uploadService.saveThumbnail(file);
          const { entity: entityName, ...modelData } = body;
          const model = {} as RxMedia;
          model.name = modelData.name || file.originalname;
          model.fileName = file.originalname;
          model.mimetype = file.mimetype;
          model.path = fileName;
          model.size = file.size;
          model.mediaType = getFileType(file);
          model.folder =
            !modelData.folder || modelData.folder === 'null'
              ? null
              : modelData.folder;
          model.owner = modelData.owner;
          result = await entityService.post({ [entityName]: model });
        },
      );

      return result;
    } catch (error: any) {
      console.error('Upload error:', error);
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
      this.queryDirectiveService,
      this.postDirectiveService,
      this.deleteDirectiveService,
      this.schemaService,
      this.storageService,
      this.mailerSendService,
      this.rxEventGateway,
    );
  }
}
