import { TOKEN_GET_MANY } from 'magic/base/tokens';
import { QueryEntityMeta } from './query.entity-meta';

export class QueryRootMeta extends QueryEntityMeta {
  fetchString: 'getOne' | 'getMany' | 'count' = TOKEN_GET_MANY;
}
