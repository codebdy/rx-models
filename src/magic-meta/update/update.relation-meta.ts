import { UpdateEntityMeta } from './update.entity-meta';

export class UpdateRelationMeta extends UpdateEntityMeta {
  parentEntityMeta: UpdateEntityMeta;
  name: string;
}
