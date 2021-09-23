import { ColumnType as MetaColumnType } from 'schema/graph-meta-interface/column-type';
import { ColumnType } from 'typeorm';

export function convertType(type: MetaColumnType): ColumnType {
  if (type === MetaColumnType.String || type === MetaColumnType.Enum) {
    return String;
  }

  if (type === MetaColumnType.Text) {
    return 'text';
  }
  if (type === MetaColumnType.MediumText) {
    return 'mediumtext';
  }
  if (type === MetaColumnType.LongText) {
    return 'longtext';
  }

  if (type === MetaColumnType.Boolean) {
    return Boolean;
  }

  if (type === MetaColumnType.Number) {
    return Number;
  }

  if (type === MetaColumnType.Date) {
    return Date;
  }

  if (type === MetaColumnType.SimpleJson) {
    return 'simple-json';
  }

  if (type === MetaColumnType.SimpleArray) {
    return 'simple-array';
  }
}
