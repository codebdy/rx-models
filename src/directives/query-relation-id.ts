import { DirectiveType } from 'directive/directive-type';
import { QueryRelationDirective } from 'directive/query/query.relation-directive';

export class QueryModelTakeDirective extends QueryRelationDirective {
  static description = `
    Magic query directive, id directive, to only get id field.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_RELATION_DIRECTIVE;

  static directiveName = 'id';

  get params() {
    return this.directiveMeta.value;
  }

  async filterEntity(entity: any): Promise<any> {
    return { id: entity['id'] };
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
