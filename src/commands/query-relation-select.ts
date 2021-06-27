import { CommandType } from 'src/command/query-command';
import { QueryRelationCommand } from 'src/command/query-relation-command';
import { SelectQueryBuilder } from 'typeorm';

export class QueryModelTakeCommand extends QueryRelationCommand {
  static description = `
    Magic query command, select command, to filter selected field.
  `;

  static version = '1.0';

  static commandType = CommandType.QUERY_RELATION_COMMAND;

  static commandName = 'select';

  get params() {
    return this.commandMeta.value;
  }

  addToQueryBuilder(qb: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    if (!this.params || this.params.length === 0) {
      throw new Error('Select command no params');
    }
    qb.select(
      this.params.map((field: string) => {
        if (!field?.trim || typeof field !== 'string') {
          throw new Error(`Select command no param"${field}" is illegal`);
        }
        return this.relationMeta.alias + '.' + field;
      }),
    );
    qb.addSelect([this.relationMeta.alias + '.id']);
    return qb;
  }
}
