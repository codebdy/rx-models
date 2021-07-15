import { QueryResult } from 'src/common/query-result';

export interface MagicService {
  query(json: any): Promise<QueryResult>;

  post(json: any): Promise<any>;

  delete(json: any): Promise<any>;

  update(json: any): Promise<any>;
}
