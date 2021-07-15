import { MagicService } from 'src/magic-meta/magic.service';
import { CommandType } from '../command-type';
import { CommandMeta } from '../command.meta';
import { PostCommand } from './post.command';

export interface PostCommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
  new (commandMeta: CommandMeta, magicService: MagicService): PostCommand;
}
