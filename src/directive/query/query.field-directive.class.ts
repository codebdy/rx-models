import { DirectiveMeta } from '../directive.meta';
import { MagicService } from 'magic-meta/magic.service';
import { QueryRootMeta } from 'magic-meta/query/query.root-meta';
import { SchemaService } from 'schema/schema.service';
import { StorageService } from 'storage/storage.service';
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
