/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicService } from 'src/magic-meta/magic.service';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';
import { DirectiveMeta } from '../directive.meta';
import { QueryDirective } from './query.directive';

export class QueryRelationDirective extends QueryDirective {
  constructor(
    protected readonly directiveMeta: DirectiveMeta,
    protected readonly rootMeta: QueryRootMeta,
    protected readonly relationMeta: QueryRelationMeta,
    protected readonly magicService: MagicService,
    protected readonly schemaService: SchemaService,
  ) {
    super(directiveMeta, rootMeta, magicService, schemaService);
  }
}
