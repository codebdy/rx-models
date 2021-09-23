import { DirectiveType } from 'src/directive/directive-type';
import { QueryFieldDirective } from 'src/directive/query/query.field-directive';
import { DEFAULT_FILE_PATH_FIELD, THUMBNAIL_SIZE } from 'src/util/consts';

export class QueryFieldImageThumbnailDirective extends QueryFieldDirective {
  static description = `获取RxMedia对象缩略图，网址附加到thumbnail字段，格式thumbnail(path?), 参数默认为path`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_FIELD_DIRECTIVE;

  static directiveName = 'thumbnail';

  async filterEntity(entity: any): Promise<any> {
    const field = this.directiveMeta.value[0] || DEFAULT_FILE_PATH_FIELD;
    entity.thumbnail = await this.storageService.resizeImage(
      entity[field],
      THUMBNAIL_SIZE,
    );
    return entity;
  }
}
