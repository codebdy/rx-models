import { ColumnType } from './column-type';

export interface ColumnMeta {
  uuid: string;
  name: string;
  type: ColumnType;
  primary?: boolean;
  generated?: true | 'uuid' | 'rowid' | 'increment';
  createDate?: boolean;
  updateDate?: boolean;
  deleteDate?: boolean;
  version?: boolean;
  length?: string | number;
  width?: number;
  nullable?: boolean;
  readonly?: boolean;
  select?: boolean;
  /**
   * Specifies if column's value must be unique or not.
   */
  unique?: boolean;

  index?: boolean;

  /**
   * Column comment.
   */
  comment?: string;
  /**
   * Default database value.
   */
  default?: any;
  /**
   * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
   * number of digits that are stored for the values.
   */
  precision?: number;
  /**
   * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
   * of digits to the right of the decimal point and must not be greater than precision.
   */
  scale?: number;

  /**
   * Defines a column collation.
   */
  //collation?: string;
}
