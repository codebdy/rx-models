import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { QueryResult } from 'src/common/query-result';
import { TOKEN_GET_ONE } from 'src/magic/base/tokens';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTreeCommand extends QueryCommand {
  static description = `Magic query command, make result to a tree struct.`;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'tree';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (this.rootMeta.fetchString === TOKEN_GET_ONE) {
      throw Error('Tree command can not use getOne command');
    }
    return qb.leftJoinAndSelect(`${this.rootMeta.alias}.parent`, 'parent');
  }

  filterResult(result: QueryResult): QueryResult {
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
