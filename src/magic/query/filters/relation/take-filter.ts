import { RelationTakeCommand } from '../../param/relation-take-command';
import { RelationFilter } from './relation-filter';

export class RelationTakeFilter extends RelationFilter {
  private _command;
  constructor(command: RelationTakeCommand) {
    super();
    this._command = command;
  }

  filter(relations: any[]) {
    return relations;
  }
}
