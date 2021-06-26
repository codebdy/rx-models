import { CommandService } from 'src/command/command.service';
import { QueryMeta } from '../../meta/query/query-meta';

export class MagicQueryParser {
  private _json: any;

  constructor(private readonly commandService: CommandService) {}

  parse(jsonStr: string): QueryMeta {
    this._json = JSON.parse(jsonStr || '{}');
    const meta = new QueryMeta();
    return meta;
  }
}
