export interface MagicQueryParam {
  model: string;
  where?: {
    [key: string]: any;
  };
  orWhere?: {
    [key: string]: any;
  };
  [key: string]: any;
}