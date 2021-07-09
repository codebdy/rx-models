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
   * Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
   * If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column
   */
  zerofill?: boolean;
  /**
   * Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
   */
  unsigned?: boolean;
  /**
   * Defines a column character set.
   * Not supported by all database types.
   */
  charset?: string;
  /**
   * Defines a column collation.
   */
  collation?: string;
  /**
   * Generated column expression. Supports only in MySQL.
   */
  asExpression?: string;
  /**
   * Generated column type. Supports only in MySQL.
   */
  generatedType?: 'VIRTUAL' | 'STORED';
  /**
   * Return type of HSTORE column.
   * Returns value as string or as object.
   */
  hstoreType?: 'object' | 'string';
  /**
   * Indicates if this column is an array.
   * Can be simply set to true or array length can be specified.
   * Supported only by postgres.
   */
  array?: boolean;
}
