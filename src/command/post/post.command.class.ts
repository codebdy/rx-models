import { QueryModelMeta } from 'src/magic-meta/query/query.model-meta';
import { CommandMeta } from '../command.meta';
import { CommandType, PostCommand } from './post.command';

export interface PostCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (commandMeta: CommandMeta, rootMeta: QueryModelMeta): PostCommand;
}
