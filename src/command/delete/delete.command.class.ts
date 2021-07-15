import { MagicService } from 'src/magic-meta/magic.service';
import { CommandType } from '../command-type';
import { CommandMeta } from '../command.meta';
import { DeleteCommand } from './delete.command';

export interface DeleteCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (commandMeta: CommandMeta, magicService: MagicService): DeleteCommand;
}
