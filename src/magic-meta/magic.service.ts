import { QueryResult } from 'magic-meta/query/query-result';
import { RxUser } from 'entity-interface/RxUser';

export interface MagicService {
  me: RxUser;

  query(json: any): Promise<QueryResult>;

  post(json: any): Promise<any>;

  delete(json: any): Promise<any>;

  update(json: any): Promise<any>;
}
