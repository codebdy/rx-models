import { Injectable } from '@nestjs/common';
import { TreeCommand } from './param/commands/model/tree-command';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { MagicQueryParser } from './magic.query.parser';
import { MagicQuerySQLWhereParser } from './magic.query.sql-where-parser';

@Injectable()
export class MagicQueryService {
  constructor(
    private readonly typeormSerivce: TypeOrmWithSchemaService,
    private readonly queryParser: MagicQueryParser,
    private readonly sqlWhereParser: MagicQuerySQLWhereParser,
  ) {}

  async query(jsonStr: string) {
    let totalCount = 0;

    const meta = this.queryParser.parse(jsonStr);
    const qb = this.typeormSerivce
      .getRepository(meta.model)
      .createQueryBuilder(meta.modelAlias);
    if (meta.select?.length > 0) {
      qb.select(meta.select.map((field) => meta.modelAlias + '.' + field));
      qb.addSelect([meta.modelAlias + '.id']);
    }

    paramParser.whereMeta?.makeQueryBuilder(qb);

    for (const relation of paramParser.relations) {
      relation.makeQueryBuilder(qb, modelAlias);
    }

    //如果需要构建树，则需要取父节点
    if (modelUnit.needBuildTree()) {
      qb.leftJoinAndSelect(`${modelAlias}.parent`, 'parent');
    }

    paramParser.orderBys?.makeQueryBuilder(qb, modelAlias);

    const paginateCommand = paramParser.modelUnit.getPaginateCommand();
    if (paginateCommand) {
      totalCount = await qb.getCount();
      paginateCommand.makeQueryBuilder(qb);
    }
    paramParser.modelUnit.getSkipCommand()?.makeQueryBuilder(qb);
    paramParser.modelUnit.getTakeCommand()?.makeQueryBuilder(qb);

    console.debug(qb.getSql());
    let data = (await qb[modelUnit.fetchString]()) as any;
    //data = filterRelations(paramParser, data);

    //构建树
    if (modelUnit.needBuildTree()) {
      data = new TreeCommand().do(data);
    }
    const result = { data } as any;
    if (paginateCommand) {
      result.pagination = {
        pageSize: paginateCommand.pageSize,
        pageIndex: paginateCommand.pageIndex,
        totalCount: totalCount,
      };
    }
    return result;
  }
}
