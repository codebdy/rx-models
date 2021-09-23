import { DirectiveMeta } from '../directive.meta';
import { QueryDirective } from './query.directive';
import { DirectiveType } from '../directive-type';
import { MagicService } from 'magic-meta/magic.service';
import { QueryRootMeta } from 'magic-meta/query/query.root-meta';
import { SchemaService } from 'schema/schema.service';

export interface QueryDirectiveClass extends Function {
  description?: string;
  version?: string;

  directiveType: DirectiveType;
  directiveName: string;
  new (
    directiveMeta: DirectiveMeta,
    rootMeta: QueryRootMeta,
    magicService: MagicService,
    schemaService: SchemaService,
  ): QueryDirective;
}
