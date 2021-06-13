import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param/query.param.parser';
import { TOKEN_GET_MANY, TOKEN_GET_ONE } from '../base/keyword-tokens';
import { TreeCommand } from './commands/model/tree-command';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const modelUnit = paramParser.modelUnit;
    const modelAlias = modelUnit?.modelAlias;
    const queryBulider = getRepository(
      paramParser.modelUnit?.model,
    ).createQueryBuilder(modelAlias);

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
    paramParser.whereMeta?.makeQueryBuilder(queryBulider, modelAlias);

    for (const relation of paramParser.relations) {
      relation.makeQueryBuilder(queryBulider, modelAlias);
    }

    //如果需要构建树，则需要去父节点
    if (modelUnit.needBuildTree()) {
      queryBulider.leftJoinAndSelect(`${modelAlias}.parent`, 'parent');
    }

    paramParser.orderBys?.makeQueryBuilder(queryBulider, modelAlias);

    paramParser.modelUnit.getSkipCommand()?.makeQueryBuilder(queryBulider);
    paramParser.modelUnit.getTakeCommand()?.makeQueryBuilder(queryBulider);

    console.debug(queryBulider.getSql());
    let data = (await queryBulider[modelUnit.excuteString]()) as any;
    data = filterRelations(paramParser, data);

    //构建树
    if (modelUnit.needBuildTree()) {
      data = new TreeCommand().do(data);
    }
    return { data };
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
