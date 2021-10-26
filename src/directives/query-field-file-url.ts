import { DirectiveType } from 'src/directive/directive-type';
import { QueryFieldDirective } from 'src/directive/query/query.field-directive';
import { DEFAULT_FILE_PATH_FIELD } from 'src/util/consts';

export class QueryFieldFileUrlDirective extends QueryFieldDirective {
  static description = `获取文件的url，网址附加到url字段，格式url(path?), 参数默认为path`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_FIELD_DIRECTIVE;

  static directiveName = 'url';

  async filterEntity(entity: any): Promise<any> {
    const field = this.directiveMeta.value[0] || DEFAULT_FILE_PATH_FIELD;
    entity.url = await this.storageService.fileUrl(
      entity[field],
      entity['bucket'],
    );
    return entity;
  }
}
