import { TOKEN_GET_MANY } from 'src/magic/base/tokens';
import { QueryEntityMeta } from './query.entity-meta';

export class QueryRootMeta extends QueryEntityMeta {
  fetchString: 'getOne' | 'getMany' = TOKEN_GET_MANY;
}
