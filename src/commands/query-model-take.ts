import { CommandType, MagicCommand } from 'src/command/command';

export class QueryModelTakeCommand implements MagicCommand {
  commandType = CommandType.QUERY_QB_COMMAND;
  name = 'take';
}
