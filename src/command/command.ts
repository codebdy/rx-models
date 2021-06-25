export enum CommandType {
  QUERY_QB_COMMAND,
  QUERY_MODEL_COMMAND,
  QUERY_RELATION_COMMAND,
  QUERY_ATTRIBUTE_COMMAND,
}

export interface MagicCommand {
  commandType: CommandType;
  name: string;
}
