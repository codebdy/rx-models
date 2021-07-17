import { QueryEntityMeta } from 'src/magic-meta/query-old/query.entity-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { CommandType } from '../command-type';
import { MagicService } from 'src/magic-meta/magic.service';

export interface QueryCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryEntityMeta,
    magicService: MagicService,
  ): QueryCommand;
}
