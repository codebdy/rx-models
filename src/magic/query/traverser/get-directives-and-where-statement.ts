import { QueryDirective } from 'src/directive/query/query.directive';

export function getDirectivesAndWhereStatement(
  directives: QueryDirective[],
): [string, any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  directives.forEach((directive) => {
    const [whereStr, param] = directive.getAndWhereStatement() || [];
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
