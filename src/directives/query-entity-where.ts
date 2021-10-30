import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { parseWhereSql } from 'src/magic-meta/query/parse-where-sql';
import { parseRelationsFromWhereSql } from 'src/magic-meta/query/parse-relations-from-where-sql';
import { createAddonRelation } from 'src/magic/query/magic.query.parser';

export class QueryEntityWhereDirective extends QueryDirective {
  static description = `
    Where directive.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'where';

  getAndWhereStatement(): [string, any] | void {
    const meta = this.rootMeta;
    //添加条件用到的关联
    const relationInfos = parseRelationsFromWhereSql(this.directiveMeta.value);
    //meta.addonRelationInfos.push(...relationInfos);
    for (const relationInfo of relationInfos) {
      createAddonRelation(relationInfo.name, meta, this.schemaService);
    }
    /*for (const relationInfo of relationInfos) {
      const relation = new QueryRelationMeta();
      relation.entityMeta = this.schemaService.getRelationEntityMetaOrFailed(
        relationInfo.name,
        meta.entity,
      );
      relation.name = relationInfo.name;
      relation.parentEntityMeta = meta;
      if (!meta.relations.find((rela) => rela.name === relation.name)) {
        meta.addAddOnRelation(relation);
      }
    }*/

    return parseWhereSql(
      this.directiveMeta.value,
      this.rootMeta,
      this.magicService.me,
    );
  }
}
