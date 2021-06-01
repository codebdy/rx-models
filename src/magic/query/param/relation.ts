import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { JsonUnit } from './json-unit';
import { ModelParams } from './model-params';
import { RelationTakeCommand } from './relation-take-command';

export class Relation {
  private _jsonUnit: JsonUnit;
  private _modelParams: ModelParams;

  constructor(jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    this._modelParams = new ModelParams(jsonUnit.value);
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
    const commandMeta = this._jsonUnit.getTakeCommand();
    if (commandMeta) {
      return new RelationTakeCommand(commandMeta);
    }
  }
}
