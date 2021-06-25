import { CommandMeta } from 'src/command/command.meta';
import { TOKEN_LARGE_RELATION } from '../../base/tokens';
import { TakeCommand } from '../meta/take-command';

export class RelationTakeCommand extends TakeCommand {
  protected _commandMeta: CommandMeta;
  constructor(commandMeta: CommandMeta) {
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
