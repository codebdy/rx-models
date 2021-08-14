import { ColumnMeta } from './column-meta';

export enum EntityType {
  NORMAL = 'Normal',
  ENUM = 'Enum',
  INTERFACE = 'Interface',
}

export interface EntityMeta {
  uuid: string;
  name: string;
  tableName?: string;
  entityType?: EntityType;
  columns: ColumnMeta[];
}
