import { DirectiveType } from 'src/directive/directive-type';
import { QueryFieldDirective } from 'src/directive/query/query.field-directive';

export class QueryFieldImageUrllDirective extends QueryFieldDirective {
  /**
   * urlField,默认src
   * size，默认不缩放，格式100x200
   * path， 默认path
   */
  static description = `获取图片url，@imageUrl(urlField, size, path)`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_FIELD_DIRECTIVE;

  static directiveName = 'imageUrl';

  async filterEntity(entity: any): Promise<any> {
    let urlField = 'src';
    let size = undefined;
    let field = 'path';

    if (this.directiveMeta.value.length > 0) {
      urlField = this.directiveMeta.value[0];
    }

    if (this.directiveMeta.value.length > 1) {
      let sizeStr: string = this.directiveMeta.value[1];
      sizeStr = sizeStr.replace('X', 'x');
      const [width, height] = sizeStr.split('x');
      size = {
        width,
        height,
      };
    }

    if (this.directiveMeta.value.length > 2) {
      field = this.directiveMeta.value[2]
    }

    entity[urlField] = await this.storageService.resizeImage(
      entity[field],
      size,
    );
    return entity;
  }
}
