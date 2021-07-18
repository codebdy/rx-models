import { QueryEntityMeta } from './query.entity-meta';

export class QueryRelationMeta extends QueryEntityMeta {
  parentEntityMeta: QueryEntityMeta;
  name: string;
}
