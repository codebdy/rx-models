import { Injectable } from '@nestjs/common';
import { MagicQueryParamsParser } from './param/query.param.parser';
import { TOKEN_GET_MANY, TOKEN_GET_ONE } from '../base/tokens';
import { TreeCommand } from './commands/model/tree-command';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';

@Injectable()
export class MagicQueryService {
  constructor(private readonly typeormSerivce: TypeOrmWithSchemaService) {}

  async query(jsonStr: string) {
    let totalCount = 0;
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const modelUnit = paramParser.modelUnit;
    const modelAlias = modelUnit?.modelAlias;
    const queryBulider = this.typeormSerivce
      .getRepository(paramParser.modelUnit?.model)
      .createQueryBuilder(modelAlias);

    if (paramParser.select?.length > 0) {
      queryBulider.select(
        paramParser.select.map((field) => modelAlias + '.' + field),
      );
      queryBulider.addSelect([modelUnit?.modelAlias + '.id']);
    }
    //queryBulider.loadRelationCountAndMap(
    //  `${paramParser.modelUnit?.modelAlias}.relationCount`,
    //  `${paramParser.modelUnit?.modelAlias}.roles`,
    //);
    paramParser.whereMeta?.makeQueryBuilder(queryBulider);

    for (const relation of paramParser.relations) {
      relation.makeQueryBuilder(queryBulider, modelAlias);
    }

    //如果需要构建树，则需要取父节点
    if (modelUnit.needBuildTree()) {
      queryBulider.leftJoinAndSelect(`${modelAlias}.parent`, 'parent');
    }

    paramParser.orderBys?.makeQueryBuilder(queryBulider, modelAlias);

    const paginateCommand = paramParser.modelUnit.getPaginateCommand();
    if (paginateCommand) {
      totalCount = await queryBulider.getCount();
      paginateCommand.makeQueryBuilder(queryBulider);
    }
    paramParser.modelUnit.getSkipCommand()?.makeQueryBuilder(queryBulider);
    paramParser.modelUnit.getTakeCommand()?.makeQueryBuilder(queryBulider);

    console.debug(queryBulider.getSql());
    let data = (await queryBulider[modelUnit.excuteString]()) as any;
    data = filterRelations(paramParser, data);

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

function filterRelations(paramParser: MagicQueryParamsParser, result: any) {
  for (const relationFilter of paramParser.relationFilters) {
    if (paramParser.modelUnit.excuteString === TOKEN_GET_ONE) {
      result = relationFilter.do(result);
    }
    if (paramParser.modelUnit.excuteString === TOKEN_GET_MANY) {
      for (let i = 0; i < result.length; i++) {
        result[i] = relationFilter.do(result[i]);
      }
    }
  }
  return result;
}
