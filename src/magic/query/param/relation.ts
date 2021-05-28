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

  getTakeCommand() {
    return new RelationTakeCommand(this._jsonUnit.getTakeCommand());
  }
}
