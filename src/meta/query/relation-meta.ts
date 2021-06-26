import { WhereMeta } from './where-meta';

export class RelationMeta {
  alias: string;
  relationMetas: RelationMeta[] = [];
  //where: WhereMeta;
  //orderBys: OrderBy;
}
