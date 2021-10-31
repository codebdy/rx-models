import { ColumnMeta } from './column-meta';

export enum EntityType {
  NORMAL = 'Normal',
  ENUM = 'Enum',
  ABSTRACT = 'Abstract',
  INTERFACE = 'Interface',
}

export interface EntityMeta {
  uuid: string;
  name: string;
  tableName?: string;
  entityType?: EntityType;
  columns: ColumnMeta[];
  eventable?: boolean;
}
