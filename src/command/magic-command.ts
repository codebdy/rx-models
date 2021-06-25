export enum CommandType {
  QUERY_BUILDER_COMMAND,
  QUERY_MODEL_COMMAND,
  QUERY_RELATION_COMMAND,
  QUERY_ATTRIBUTE_COMMAND,
}

export interface MagicCommand {
  description?: string;
  version?: string;
  commandType: CommandType;
  name: string;
}
