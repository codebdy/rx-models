import { CommandType, QueryCommand } from 'src/command/query-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeCommand extends QueryCommand {
  static description = `
    Magic query command, select command, to filter selected field.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_MODEL_COMMAND;

  static commandName = 'select';

  get params() {
    return this.commandMeta.params;
  }

  get count() {
    return this.commandMeta.getFistNumberParam();
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (!this.params || this.params.length === 0) {
      throw new Error('Select command no params');
    }
    qb.addSelect(
      this.params.map((field) => {
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
