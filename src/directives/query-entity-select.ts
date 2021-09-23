import { QueryDirective } from 'directive/query/query.directive';
import { DirectiveType } from 'directive/directive-type';
import { SelectQueryBuilder } from 'typeorm';

export class QueryEntitySelectDirective extends QueryDirective {
  static description = `
    Magic query directive, select directive, to filter selected field.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'select';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (!this.directiveMeta.value) {
      throw new Error('Select directive no params');
    }
    qb.select(
      this.directiveMeta.value.map((field: string) => {
        if (!field?.trim || typeof field !== 'string') {
          throw new Error(`Select directive no param"${field}" is illegal`);
        }
        return this.rootMeta.alias + '.' + field;
      }),
    );
    qb.addSelect([this.rootMeta.alias + '.id']);
    return qb;
  }
}
