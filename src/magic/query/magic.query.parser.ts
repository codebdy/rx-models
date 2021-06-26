import { QueryMeta } from '../../meta/query/query-meta';

export class MagicQueryParser {
  private _json: any;

  parse(jsonStr: string): QueryMeta {
    this._json = JSON.parse(jsonStr || '{}');
    const meta = new QueryMeta();
    return meta;
  }
}
