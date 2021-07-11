export enum CommandType {
  QUERY_MODEL_COMMAND = 1,
  QUERY_RELATION_COMMAND,
  //condition command 既可以用于Medel级别，也可以用于relation级别
  QUERY_CONDITION_COMMAND,
}
