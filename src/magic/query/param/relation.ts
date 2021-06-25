import { createId } from 'src/util/create-id';
import { SelectQueryBuilder } from 'typeorm';
import { JsonUnit } from '../../base/json-unit';
import { ModelParams } from './model-params';
import { RelationTakeCommand } from './relation-take-command';

export class Relation {
  private _jsonUnit: JsonUnit;
  private _modelParams: ModelParams;
  private _alias = `relation${createId()}`;
  private _model: string;

  constructor(
    relationModel: string,
    jsonUnit: JsonUnit,
    model: string,
    modelAlias: string,
  ) {
    this._jsonUnit = jsonUnit;
    this._modelParams = new ModelParams(
      relationModel,
      jsonUnit.value,
      modelAlias,
    );
    this._model = model;
  }

  get name() {
    return this._jsonUnit.key;
  }

  get model() {
    return this._model;
  }

  get alias() {
    return this._alias;
  }

  makeQueryBuilder(
    qb: SelectQueryBuilder<any>,
    modelAlias?: string,
  ): SelectQueryBuilder<any> {
    const [
      whereString,
      whereParams,
    ] = this._modelParams.whereMeta?.getWhereStatement();
    qb.leftJoinAndSelect(
      `${modelAlias}.${this.name}`,
      this._alias,
      whereString,
      whereParams,
    );
    for (const subRelation of this._modelParams.relations) {
      subRelation.makeQueryBuilder(qb, this._alias);
    }
    this._modelParams.orderBys?.makeQueryBuilder(qb, this._alias);
    return qb;
  }

  getTakeCommand() {
    const commandMeta = this._jsonUnit.getTakeCommand();
    if (commandMeta) {
      return new RelationTakeCommand(commandMeta);
    }
  }
}
