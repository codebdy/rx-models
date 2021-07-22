import { QueryDirective } from 'src/directive/query/query.directive';
import { DirectiveType } from 'src/directive/directive-type';
import { Connection } from 'typeorm';

export class QueryMutationReadDirective extends QueryDirective {
  static description = `
    Magic query directive, orderBy directive, to sort the result.
  `;

  static version = '1.0';

  static directiveType = DirectiveType.QUERY_ENTITY_DIRECTIVE;

  static directiveName = 'read';

  mutation(model: string, connection: Connection): void {
    return;
  }
}
