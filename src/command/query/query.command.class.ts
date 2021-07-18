import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { CommandType } from '../command-type';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';

export interface QueryCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (
    commandMeta: CommandMeta,
    rootMeta: QueryRootMeta,
    magicService: MagicService,
    schemaService: SchemaService,
  ): QueryCommand;
}
