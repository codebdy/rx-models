import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { JsonUnit } from './json-unit';
import { RelationTakeCommand } from './relation-take-command';

export class Relation {
  private _jsonUnit: JsonUnit;

  //relations: RelationMeta[];
  //whereMeta: WhereMeta;
  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
  }

  get name() {
    return this._jsonUnit.key;
  }

  makeQueryBuilder(
    qb: SelectQueryBuilder<any>,
    modelAlias?: string,
  ): SelectQueryBuilder<any> {
    const relationAlias = `relation${createId()}`;
    qb.leftJoinAndSelect(`${modelAlias}.${this.name}`, relationAlias);
    return qb;
  }

  getTakeCommand() {
    return new RelationTakeCommand(this._jsonUnit.getTakeCommand());
  }
}
