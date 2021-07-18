import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';
import { parseRelationsFromWhereSql } from 'src/magic-meta/query/parse-relations-from-where-sql';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';

export class QueryEntityWhereCommand extends QueryCommand {
  static description = `
    Where command.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_ENTITY_COMMAND;

  static commandName = 'where';

  getWhereStatement(): [string, any] | void {
    const meta = this.rootMeta;
    //添加条件用到的关联
    const relationInfos = parseRelationsFromWhereSql(this.commandMeta.value);
    meta.addonRelationInfos.push(...relationInfos);
    for (const relationInfo of relationInfos) {
      const relation = new QueryRelationMeta();
      relation.entityMeta = this.schemaService.getRelationEntityMetaOrFailed(
        relationInfo.name,
        meta.entity,
      );
      relation.name = relationInfo.name;
      relation.parentEntityMeta = meta;
      meta.addonRelations.push(relation);
    }

    return parseWhereSql(
      this.commandMeta.value,
      this.rootMeta,
      this.magicService.me,
    );
  }
}
