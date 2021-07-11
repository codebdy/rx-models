import { QueryCommand } from 'src/command/query/query.command';
import { CommandType } from 'src/command/command-type';
import { Connection } from 'typeorm';

export class QueryMutationReadCommand extends QueryCommand {
  static description = `
    Magic query command, orderBy command, to sort the result.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_ENTITY_COMMAND;

  static commandName = 'read';

  mutation(model: string, connection: Connection): void {
    return;
  }
}
