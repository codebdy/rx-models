import { DirectiveType } from 'src/directive/directive-type';
import { QueryRelationDirective } from 'src/directive/query/query.relation-directive';
//import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeDirective extends QueryRelationDirective {
  static description = `
    Magic query directive, select directive, to filter selected field.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'select';

  get params() {
    return this.directiveMeta.value;
  }

  async filterEntity(entity: any): Promise<any> {
    if (!this.params || this.params.length === 0) {
      throw new Error('Select directive no params');
    }

    const newEntity = {} as any;

    for (const field of this.params) {
      if (!field?.trim || typeof field !== 'string') {
        throw new Error(`Select directive no param"${field}" is illegal`);
      }
      newEntity[field] = entity[field];
    }

    return newEntity;
  }

  /*addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (!this.params || this.params.length === 0) {
      throw new Error('Select directive no params');
    }

    console.log(this.params);
    qb.select(
      this.params.map((field: string) => {
        if (!field?.trim || typeof field !== 'string') {
          throw new Error(`Select directive no param"${field}" is illegal`);
        }
        return this.relationMeta.alias + '.' + field;
      }),
    );
    qb.addSelect([this.relationMeta.alias + '.id']);
    return qb;
  }*/
}
