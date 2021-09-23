import { QueryDirective } from 'directive/query/query.directive';

export function getDirectivesWhereStatement(
  directives: QueryDirective[],
): [string, any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  directives.forEach((directive) => {
    const [whereStr, param] = directive.getWhereStatement() || [];
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
