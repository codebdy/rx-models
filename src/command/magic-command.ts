export enum CommandType {
  QUERY_BUILDER_COMMAND = 1,
  QUERY_MODEL_COMMAND,
  QUERY_RELATION_COMMAND,
  QUERY_CONDITION_COMMAND,
}

// eslint-disable-next-line prettier/prettier
export interface CommandClass extends Function {
  description?: string;
  version?: string;

  commandType: CommandType;
  commandName: string;
}
