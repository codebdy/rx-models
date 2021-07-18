import { QueryCommand } from 'src/command/query/query.command';

export function getCommandsWhereStatement(
  commands: QueryCommand[],
): [string, any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  commands.forEach((command) => {
    const [whereStr, param] = command.getWhereStatement() || [];
    if (whereStr) {
      whereStringArray.push(whereStr);
      whereParams = { ...whereParams, ...param };
    }
  });
  if (whereStringArray.length > 0) {
    return [whereStringArray.join(' AND '), whereParams];
  }
  return [undefined, undefined];
}
