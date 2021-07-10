import { ColumnMeta } from './column-meta';

export enum EntityType {
  enum = 'Enum',
}

export interface EntityMeta {
  uuid: string;
  name: string;
  tableName?: string;
  entityType?: EntityType;
  columns: ColumnMeta[];
}
