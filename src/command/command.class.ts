import { CommandType } from './query-command';

// eslint-disable-next-line prettier/prettier
export interface CommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
}
