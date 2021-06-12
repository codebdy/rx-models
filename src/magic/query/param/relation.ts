import { createId } from 'src/utils/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { JsonUnit } from '../../base/json-unit';
import { ModelParams } from './model-params';
import { RelationTakeCommand } from './relation-take-command';

export class Relation {
  private _jsonUnit: JsonUnit;
  private _modelParams: ModelParams;

  constructor(model: string, jsonUnit: JsonUnit) {
    this._jsonUnit = jsonUnit;
    this._modelParams = new ModelParams(model, jsonUnit.value);
  }

  get name() {
    return this._jsonUnit.key;
  }

  makeQueryBuilder(
    qb: SelectQueryBuilder<any>,
    modelAlias?: string,
  ): SelectQueryBuilder<any> {
    const relationAlias = `relation${createId()}`;
    const [
      whereString,
      whereParams,
    ] = this._modelParams.whereMeta?.getWhereStatement(relationAlias);
    qb.leftJoinAndSelect(
      `${modelAlias}.${this.name}`,
      relationAlias,
      whereString,
      whereParams,
    );
    for (const subRelation of this._modelParams.relations) {
      subRelation.makeQueryBuilder(qb, relationAlias);
    }
    this._modelParams.orderBys?.makeQueryBuilder(qb, relationAlias);
    return qb;
  }

  getTakeCommand() {
    const commandMeta = this._jsonUnit.getTakeCommand();
    if (commandMeta) {
      return new RelationTakeCommand(commandMeta);
    }
  }
}
