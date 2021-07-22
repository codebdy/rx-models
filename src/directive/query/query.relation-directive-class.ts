import { DirectiveMeta } from '../directive.meta';
import { QueryDirectiveClass } from './query.directive.class';
import { QueryDirective } from './query.directive';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { SchemaService } from 'src/schema/schema.service';

export interface QueryRelationDirectiveClass extends QueryDirectiveClass {
  new (
    directiveMeta: DirectiveMeta,
    rootMeta: QueryRootMeta,
    relationMeta: QueryRelationMeta,
    magicService: MagicService,
    schemaService: SchemaService,
  ): QueryDirective;
}
