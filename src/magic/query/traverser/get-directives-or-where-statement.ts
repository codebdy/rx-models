import { QueryDirective } from 'src/directive/query/query.directive';

export function getDirectivesOrWhereStatement(
  directives: QueryDirective[],
): [string, any] {
  const whereStringArray: string[] = [];
  let whereParams: any = {};
  directives.forEach((directive) => {
    const [whereStr, param] = directive.getOrWhereStatement() || [];
    if (whereStr) {
      whereStringArray.push(whereStr);
      whereParams = { ...whereParams, ...param };
    }
  });
  if (whereStringArray.length > 0) {
    return [whereStringArray.join(' OR '), whereParams];
  }
  return [undefined, undefined];
}
