import { QueryDirectiveClass } from './query.directive.class';
import { DirectiveMeta } from '../directive.meta';
import { QueryDirective } from './query.directive';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';

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
