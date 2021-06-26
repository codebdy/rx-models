/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandMeta } from './command.meta';
import { QueryCommand } from './query-command';

export class QueryRelationCommand extends QueryCommand {
  constructor(commandMeta: CommandMeta) {
    super(commandMeta);
  }

  /**
   * 构建条件SQL，请不要包含where
   * @param field 字段，可省略
   * @param value 值，可省略
   * @returns 返回构建好的SQL语句跟参数
   */
  getWhereStatement(field?: string, value?: string): [string, any] | void {
    return;
  }
}
