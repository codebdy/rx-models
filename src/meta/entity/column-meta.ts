export enum ColumnType {
  Number = 'Number',
  Boolean = 'Boolean',
  String = 'String',
}
export interface ColumnMeta {
  uuid: string;
  name: string;
  type: ColumnType;
  primary?: boolean;
  generated?: true | 'uuid' | 'rowid' | 'increment';
}
