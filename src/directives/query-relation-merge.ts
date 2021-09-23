import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';

export class QueryModelMergeDirective extends QueryRelationDirective {
  static description = `
    把指定的某个字段合并到父实体merge(fieldName, fieldNameOnParent)
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'merge';

  get params() {
    return this.directiveMeta.value;
  }

  async filterEntity(entity: any, parentEntity: any): Promise<any> {
    if (!this.params || this.params.length < 2) {
      throw new Error('Merge directive params too less');
    }

    const fieldName = this.params[0];
    const fieldNameOnParent = this.params[1];

    if (entity && parentEntity) {
      parentEntity[fieldNameOnParent] = entity[fieldName];
    } else {
      throw new Error('Instance or Instance entity is undefined');
    }

    return entity;
  }
}
