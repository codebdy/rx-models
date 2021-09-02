import { DirectiveType } from 'src/directive/directive-type';
import { QueryEntityDirective } from 'src/directive/query/query.field-directive';

export class QueryEntityImageThumbnailDirective extends QueryEntityDirective {
  static description = `获取RxMedia对象缩略图，网址附加到thumbnail字段`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_FIELD_DIRECTIVE;

  static directiveName = 'thumbnail';

  filterEntity(entity: any): any {
    return entity;
  }
}
