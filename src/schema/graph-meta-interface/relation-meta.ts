import { RelationType } from './relation-type';

export interface RelationMeta {
  uuid: string;
  relationType: RelationType;
  sourceId: string;
  targetId: string;
  roleOnSource: string;
  roleOnTarget: string;
  ownerId?: string;
}
