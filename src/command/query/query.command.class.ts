import { QueryModelMeta } from 'src/magic-meta/query/query.model-meta';
import { CommandMeta } from '../command.meta';
import { QueryCommand } from './query.command';
import { CommandType } from "../command-type";

export interface QueryCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (commandMeta: CommandMeta, rootMeta: QueryModelMeta): QueryCommand;
}
