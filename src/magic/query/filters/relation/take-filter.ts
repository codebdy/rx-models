import { RelationFilter } from './relation-filter';

export class RelationTakeFilter extends RelationFilter {
  private _relationName;
  private _count;
  constructor(relationName: string, count: number) {
    super();
    this._relationName = relationName;
    this._count = count;
  }

  filter(relations: any[]) {
    return relations;
  }
}
