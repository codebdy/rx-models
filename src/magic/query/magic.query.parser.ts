import { MagicQueryMeta } from './meta/magic.query.meta';

export class MagicQueryParser {
  private _json: any;

  parse(jsonStr: string): MagicQueryMeta {
    this._json = JSON.parse(jsonStr || '{}');
    const meta = new MagicQueryMeta();
    return meta;
  }
}
