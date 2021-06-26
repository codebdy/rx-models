import { Injectable } from '@nestjs/common';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { MagicQueryParser } from './magic.query.parser';
import { QueryResult } from 'src/common/query-result';

@Injectable()
export class MagicQueryService {
  constructor(
    private readonly typeormSerivce: TypeOrmWithSchemaService,
    private readonly queryParser: MagicQueryParser,
  ) {}

  async query(jsonStr: string) {
    let totalCount = 0;

    const meta = this.queryParser.parse(jsonStr);
    const qb = this.typeormSerivce
      .getRepository(meta.model)
      .createQueryBuilder(meta.modelAlias);

    //paramParser.whereMeta?.makeQueryBuilder(qb);

    //for (const relation of paramParser.relations) {
    //  relation.makeQueryBuilder(qb, modelAlias);
    //}

    totalCount = await qb.getCount();

    console.debug(qb.getSql());
    const data = (await qb[meta.fetchString]()) as any;
    //data = filterRelations(paramParser, data);

    const result = { data, totalCount } as QueryResult;

    return result;
  }
}
