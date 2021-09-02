import { DirectiveMeta } from '../directive.meta';
import { QueryDirective } from './query.directive';
import { DirectiveType } from '../directive-type';
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';
import { StorageService } from 'src/storage/storage.service';

export interface QueryFieldDirectiveClass extends Function {
  description?: string;
  version?: string;

  directiveType: DirectiveType;
  directiveName: string;
  new (
    directiveMeta: DirectiveMeta,
    rootMeta: QueryRootMeta,
    magicService: MagicService,
    schemaService: SchemaService,
    storageService: StorageService,
  ): QueryDirective;
}
