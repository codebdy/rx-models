import { Command } from '../../base/command';
import { TOKEN_LARGE_RELATION } from '../../base/keyword-tokens';
import { TakeCommand } from './take-command';

export class RelationTakeCommand extends TakeCommand {
  protected _commandMeta: Command;
  constructor(commandMeta: Command) {
    super(commandMeta);
  }

  isLargeRelation() {
    return (
      this._commandMeta.params.length > 1 &&
      this._commandMeta.params[1].toLowerCase() ===
        TOKEN_LARGE_RELATION.toLowerCase()
    );
  }
}
