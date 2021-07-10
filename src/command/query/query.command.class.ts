import { QueryModelMeta } from 'src/meta/query/query.model-meta';
import { CommandMeta } from '../command.meta';
import { CommandType, QueryCommand } from './query.command';

export interface QueryCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (commandMeta: CommandMeta, rootMeta: QueryModelMeta): QueryCommand;
}
