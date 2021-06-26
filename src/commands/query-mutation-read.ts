import { CommandType, QueryCommand } from 'src/command/query-command';
import { Connection } from 'typeorm';

export class QueryMutationReadCommand extends QueryCommand {
  static description = `
    Magic query command, orderBy command, to sort the result.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'read';

  mutation(model: string, connection: Connection): void {
    return;
  }
}
