import { QueryCommand } from 'src/command/query-command';
import { createId } from 'src/util/create-id';
import { EntitySchema } from 'typeorm';
import { QueryRelationMeta } from './query.relation-meta';

export abstract class QueryMeta {
  id: number;
  entitySchema: EntitySchema<any>;
  private _model: string;
  relationMetas: QueryRelationMeta[] = [];
  conditionCommands: QueryCommand[] = [];

  constructor() {
    this.id = createId();
  }

  public get model(): string {
    return this._model;
  }
  public set model(value: string) {
    this._model = value;
  }

  get alias() {
    return this.model?.toLowerCase() + this.id;
  }

  abstract pushCommand(command: QueryCommand): void;

  pushCondition(command: QueryCommand) {
    this.conditionCommands.push(command);
  }

  findRelatiOrFailed(relationName: string): QueryRelationMeta {
    for (const relationMeta of this.relationMetas) {
      if (relationMeta.name === relationName) {
        return relationMeta;
      }
    }
    throw new Error(
      `Please add relation ${relationName} of ${this.model} to query meta`,
    );
  }
}
