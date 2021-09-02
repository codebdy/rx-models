import { DirectiveMeta } from '../directive.meta';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';
import { StorageService } from 'src/storage/storage.service';
import { QueryDirectiveClass } from './query.directive.class';
import { QueryFieldDirective } from './query.field-directive';

export interface QueryFieldDirectiveClass extends QueryDirectiveClass {
  new (
    directiveMeta: DirectiveMeta,
    rootMeta: QueryRootMeta,
    magicService: MagicService,
    schemaService: SchemaService,
    storageService: StorageService,
  ): QueryFieldDirective;
}
