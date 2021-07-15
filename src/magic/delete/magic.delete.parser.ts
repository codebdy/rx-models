import { JsonUnit } from '../base/json-unit';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { SchemaService } from 'src/schema/schema.service';
import { DeleteCommandService } from 'src/command/delete-command.service';
import { MagicInstanceService } from '../magic.instance.service';

export class MagicDeleteParser {
  constructor(
    private readonly commandService: DeleteCommandService,
    private readonly schemaService: SchemaService,
    private readonly instanceService: MagicInstanceService,
  ) {}

  parse(json: any) {
    const deleteMetas: DeleteMeta[] = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const deleteMeta = new DeleteMeta(jsonUnit);
      for (const commandMeta of jsonUnit.commands) {
        const CommandClass = this.commandService.findCommandOrFailed(
          commandMeta.name,
        );
        deleteMeta.commands.push(
          new CommandClass(
            commandMeta,
            this.schemaService,
            this.instanceService,
          ),
        );
      }

      deleteMetas.push(deleteMeta);
    }
    console.debug('MagicDeleteParser', deleteMetas);
    return deleteMetas;
  }
}
