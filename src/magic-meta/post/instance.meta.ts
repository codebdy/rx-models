import { RelationMetaCollection } from './relation.meta.colletion';

export class InstanceMeta {
  meta: any = {};
  relations: { [key: string]: RelationMetaCollection } = {};
  savedRelations: { [key: string]: any } = {};
  entity: string;
}
