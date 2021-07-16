import { JsonUnit } from '../base/json-unit';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { MagicService } from 'src/magic-meta/magic.service';
import { DeleteCommandService } from 'src/command/delete-command.service';

export class MagicDeleteParser {
  constructor(
    private readonly deleteCommandService: DeleteCommandService,
    private readonly magicService: MagicService,
  ) {}

  parse(json: any) {
    const deleteMetas: DeleteMeta[] = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const deleteMeta = new DeleteMeta(jsonUnit);
      for (const commandMeta of jsonUnit.commands) {
        const CommandClass = this.deleteCommandService.findCommandOrFailed(
          commandMeta.name,
        );
        deleteMeta.commands.push(
          new CommandClass(commandMeta, this.magicService),
        );
      }

      deleteMetas.push(deleteMeta);
    }
    console.debug('MagicDeleteParser', deleteMetas);
    return deleteMetas;
  }
}
