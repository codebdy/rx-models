import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { QueryResult } from 'src/magic-meta/query/query-result';
import { TOKEN_GET_ONE } from 'src/magic/base/tokens';
import { SelectQueryBuilder } from 'typeorm';

export class QueryEntityTreeDirective extends QueryDirective {
  static description = `Magic query directive, make result to a tree struct.`;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'tree';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (this.rootMeta.fetchString === TOKEN_GET_ONE) {
      throw Error('Tree directive can not use getOne directive');
    }
    return qb.leftJoinAndSelect(`${this.rootMeta.alias}.parent`, 'parent');
  }

  async filterResult(result: QueryResult) {
    result.data = this.do(result.data);
    return result;
  }

  private do(models: any[]) {
    const roots = [];
    const leftModels = [];
    for (const model of models) {
      if (!model.parent) {
        roots.push(model);
      } else {
        leftModels.push(model);
      }
    }

    for (const child of roots) {
      this.buildChildren(child, leftModels);
    }
    return roots;
  }

  private buildChildren(parentModel: any, models: any[]) {
    parentModel.children = [];
    const leftModels = [];
    for (const model of models) {
      if (model.parent?.id && model.parent.id === parentModel.id) {
        parentModel.children.push(model);
        delete model.parent;
      } else {
        leftModels.push(model);
      }
    }

    for (const child of parentModel.children) {
      this.buildChildren(child, leftModels);
    }
  }
}
