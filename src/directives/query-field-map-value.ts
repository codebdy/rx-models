import { DirectiveType } from 'directive/directive-type';
import { QueryFieldDirective } from 'directive/query/query.field-directive';

export class QueryFieldMapValuelDirective extends QueryFieldDirective {
  static description = `映射字段值，@mapValue(field, oldValue, newValue)`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_FIELD_DIRECTIVE;

  static directiveName = 'mapValue';

  async filterEntity(entity: any): Promise<any> {
    if (this.directiveMeta.value.length < 1) {
      throw new Error('mapValue directive has too few params');
    }

    const field = this.directiveMeta.value[0];
    const mapObject = this.directiveMeta.value[1];

    if (typeof mapObject !== 'object') {
      throw new Error('mapValue directive has not value map object');
    }

    for (const oldValue in mapObject) {
      if (entity[field] === oldValue) {
        entity[field] = mapObject[oldValue];
      }
    }

    return entity;
  }
}
