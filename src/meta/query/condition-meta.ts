import { QueryConditionCommand } from 'src/command/query-condition-command';
import { QueryConditionEqualCommand } from 'src/commands/query-condition-equal';

export class ConditionMeta {
  /**
   * 条件名称
   */
  field: string;

  /**
   * 条件值
   */
  value: any;

  /**
   * 条件命令，一个条件有且仅有一个命令，默认是equal命令
   */
  command: QueryConditionCommand;
}
