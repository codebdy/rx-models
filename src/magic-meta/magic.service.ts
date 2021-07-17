import { QueryResult } from 'src/common/query-result';
import { RxUser } from 'src/entity-interface/rx-user';

export interface MagicService {
  me: RxUser;

  query(json: any): Promise<QueryResult>;

  post(json: any): Promise<any>;

  delete(json: any): Promise<any>;

  update(json: any): Promise<any>;
}
