import { CommandType, QueryCommand } from 'src/command/query-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeCommand extends QueryCommand {
  static description = `
    Magic query command, select command, to filter selected field.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'select';

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (!this.commandMeta.value) {
      throw new Error('Select command no params');
    }
    qb.addSelect(
      this.commandMeta.value.map((field: string) => {
        if (!field?.trim || typeof field !== 'string') {
          throw new Error(`Select command no param"${field}" is illegal`);
        }
        return this.rootMeta.alias + '.' + field;
      }),
    );
    qb.addSelect([this.rootMeta.alias + '.id']);
    return qb;
  }
}
