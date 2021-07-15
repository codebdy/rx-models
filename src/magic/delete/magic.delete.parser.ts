import { JsonUnit } from '../base/json-unit';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { MagicInstanceService } from '../magic.instance.service';

export class MagicDeleteParser {
  constructor(private readonly instanceService: MagicInstanceService) {}

  parse(json: any) {
    const deleteMetas: DeleteMeta[] = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const deleteMeta = new DeleteMeta(jsonUnit);
      for (const commandMeta of jsonUnit.commands) {
        const CommandClass = this.instanceService.deleteCommandService.findCommandOrFailed(
          commandMeta.name,
        );
        deleteMeta.commands.push(
          new CommandClass(commandMeta, this.instanceService),
        );
      }

      deleteMetas.push(deleteMeta);
    }
    console.debug('MagicDeleteParser', deleteMetas);
    return deleteMetas;
  }
}
