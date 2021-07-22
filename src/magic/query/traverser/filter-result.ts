import { RxUser } from 'src/entity-interface/RxUser';
import { QueryResult } from 'src/magic-meta/query/query-result';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';

export function filterResult(
  result: QueryResult,
  rootMeta: QueryRootMeta,
  me: RxUser,
) {
  if (Array.isArray(result.data)) {
    for (const instance of result.data) {
      filterOneInstance(instance, rootMeta, me);
    }
  } else {
    filterOneInstance(result.data, rootMeta, me);
  }
  //进行command过滤
  for (const command of rootMeta.directives) {
    result = command.filterResult(result);
  }
  return result;
}

function filterOneInstance(instance: any, meta: QueryEntityMeta, me: RxUser) {
  if (!instance) {
    return instance;
  }
  //基于权限过滤
  if (meta.expandFieldForAuth && !(me.isDemo || me.isSupper)) {
    const fields = meta.getHasQueryAbilityFields();
    for (const column of meta.entityMeta.columns) {
      const fieldName = column.name;
      if (!fields.find((field) => field === fieldName) && fieldName != 'id') {
        delete instance[fieldName];
      }
    }
  }
  //删除无用的addon relation
  for (const addonRelation of meta.addonRelations) {
    if (
      !meta.relations.find((relation) => relation.name === addonRelation.name)
    ) {
      delete instance[addonRelation.name];
    }
  }
  //进行command过滤

  //递归处理关联
  for (const relation of meta.relations) {
    const relationInstance = instance[relation.name];
    if (Array.isArray(relationInstance)) {
      for (const obj of relationInstance) {
        filterOneInstance(obj, relation, me);
      }
    } else {
      filterOneInstance(relationInstance, relation, me);
    }
  }
  return instance;
}
