import { QueryDirectiveClass } from './query.directive.class';
import { DirectiveMeta } from '../directive.meta';
import { QueryDirective } from './query.directive';
import { MagicService } from 'magic-meta/magic.service';
import { QueryEntityMeta } from 'magic-meta/query/query.entity-meta';
import { QueryRootMeta } from 'magic-meta/query/query.root-meta';
import { SchemaService } from 'schema/schema.service';

export interface QueryConditionDirectiveClass extends QueryDirectiveClass {
  new (
    directiveMeta: DirectiveMeta,
    rootMeta: QueryRootMeta,
    ownerMeta: QueryEntityMeta,
    field: string,
    magicService: MagicService,
    schemaService: SchemaService,
  ): QueryDirective;
}
