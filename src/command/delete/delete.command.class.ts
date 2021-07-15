import { MagicInstanceService } from 'src/magic/magic.instance.service';
import { CommandType } from '../command-type';
import { CommandMeta } from '../command.meta';
import { DeleteCommand } from './delete.command';

export interface DeleteCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (
    commandMeta: CommandMeta,
    instanceService: MagicInstanceService,
  ): DeleteCommand;
}
