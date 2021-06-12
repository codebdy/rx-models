import { RelationCommand } from './relation-command';

export class RelationTakeCommand extends RelationCommand {
  private _relationName;
  private _count;
  constructor(relationName: string, count: number) {
    super();
    this._relationName = relationName;
    this._count = count;
  }

  do(model: any) {
    model[this._relationName] = model[this._relationName].slice(0, this._count);
    return model;
  }
}
