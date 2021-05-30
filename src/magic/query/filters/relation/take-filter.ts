import { RelationFilter } from './relation-filter';

export class TakeFilter extends RelationFilter {
  private _count;
  constructor(count: number) {
    super();
    this._count = count;
  }

  filter(relations: any[]) {
    return relations;
  }
}
