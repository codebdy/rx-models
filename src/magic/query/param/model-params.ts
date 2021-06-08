import { RelationFilter } from '../filters/relation/relation-filter';
import { RelationTakeFilter } from '../filters/relation/take-filter';
import { Condition } from './condition';
import { JsonUnit } from '../../base/json-unit';
import { OrderBy } from './order-by';
import { Relation } from './relation';
import { Where } from './where';

export class ModelParams {
  private _relations: Relation[] = [];
  private _select: string[] = [];
  private _orderBys: OrderBy;
  private _whereMeta: Where = new Where();
  private _relationFilters: RelationFilter[] = [];

  constructor(json: any) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      if (jsonUnit.isRlationShip()) {
        const relation = new Relation(jsonUnit);
        const takeCommand = relation.getTakeCommand();
        if (takeCommand) {
          this._relationFilters.push(
            new RelationTakeFilter(relation.name, takeCommand.count),
          );
        }
        this._relations.push(relation);
      } else if (jsonUnit.isSelect()) {
        this._select = jsonUnit.value;
      } else if (jsonUnit.isOrderBy()) {
        this._orderBys = new OrderBy(jsonUnit.value);
      } else {
        this._whereMeta.addCondition(new Condition(keyStr, value));
      }
    }
  }

  get relations() {
    return this._relations;
  }

  get select() {
    return this._select;
  }

  get orderBys() {
    return this._orderBys;
  }

  get relationFilters() {
    return this._relationFilters;
  }

  get whereMeta() {
    return this._whereMeta;
  }
}
