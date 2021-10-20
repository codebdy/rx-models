import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { QueryResult } from 'src/magic-meta/query/query-result';
import {
  TOKEN_ENTITY,
  TOKEN_LINKE_FIELDS,
  TOKEN_RELATION_NAME,
} from 'src/magic/base/tokens';

export class QueryEntityFakeRelationDirective extends QueryDirective {
  static description = `
    Magic query directive, @fakeRelation.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'fakeRelation';

  async filterResult(result: QueryResult) {
    const queryJSON = {} as any;
    let relationEntity = '';
    let relationName = '';
    let linkFields = [];
    const dirValue = this.directiveMeta?.value || ({} as any);
    for (const key in dirValue) {
      const keyStr = key.trim();
      if (keyStr.replace('@', '').trim() === TOKEN_ENTITY) {
        relationEntity = dirValue[key];
        queryJSON['entity'] = relationEntity;
      } else if (keyStr.startsWith('@')) {
        if (keyStr.replace('@', '').trim() === TOKEN_RELATION_NAME) {
          relationName = dirValue[key];
        } else if (keyStr.replace('@', '').trim() === TOKEN_LINKE_FIELDS) {
          linkFields = dirValue[key];
        } else {
          queryJSON[key] = dirValue[key];
        }
      } else {
        queryJSON[key] = dirValue[key];
      }
    }

    if (!relationEntity) {
      throw new Error('No entity on directive fakeRelation');
    }
    if (!relationName) {
      throw new Error('No relationName on directive fakeRelation');
    }
    if (!linkFields || !linkFields.length || linkFields.length < 2) {
      throw new Error('linkFields error on directive fakeRelation');
    }

    const [rootField, relationField] = linkFields;

    const data = Array.isArray(result.data) ? result.data : [result.data];

    const linkFieldValues = data
      .map((obj) => obj[rootField])
      .filter((vl) => vl !== undefined);

    if (linkFieldValues?.length) {
      queryJSON[relationField + '@in'] = linkFieldValues;
      const relationResult = await this.magicService.query(queryJSON);
      for (const instance of data) {
        const linkValue = instance[rootField];
        instance[relationName] = relationResult?.data?.find(
          (obj) => obj[relationField] === linkValue,
        );
      }
    }

    return result;
  }
}
