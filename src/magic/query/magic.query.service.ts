import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { MagicQueryParamsParser } from './param/query.param.parser';
import { TOKEN_GET_MANY, TOKEN_GET_ONE } from './param/keyword-tokens';

@Injectable()
export class MagicQueryService {
  async query(jsonStr: string) {
    const paramParser = new MagicQueryParamsParser(jsonStr);
    const modelAlias = paramParser.modelUnit?.modelAlias;
    const queryBulider = getRepository(
      paramParser.modelUnit?.model,
    ).createQueryBuilder(modelAlias);

    if (paramParser.select?.length > 0) {
      queryBulider.select(
        paramParser.select.map((field) => modelAlias + '.' + field),
      );
      queryBulider.addSelect([paramParser.modelUnit?.modelAlias + '.id']);
    }
    //queryBulider.loadRelationCountAndMap(
    //  `${paramParser.modelUnit?.modelAlias}.relationCount`,
    //  `${paramParser.modelUnit?.modelAlias}.roles`,
    //);
    paramParser.whereMeta?.makeQueryBuilder(queryBulider, modelAlias);

    for (const relation of paramParser.relations) {
      relation.makeQueryBuilder(queryBulider, modelAlias);
    }

    paramParser.orderBys?.makeQueryBuilder(queryBulider, modelAlias);

    paramParser.modelUnit.getSkipCommand()?.makeQueryBuilder(queryBulider);
    paramParser.modelUnit.getTakeCommand()?.makeQueryBuilder(queryBulider);

    console.log(queryBulider.getSql());
    let result = (await queryBulider[
      paramParser.modelUnit.excuteString
    ]()) as any;
    result = filterRelations(paramParser, result);
    return result;
  }
}

function filterRelations(paramParser: MagicQueryParamsParser, result: any) {
  for (const relationFilter of paramParser.relationFilters) {
    if (paramParser.modelUnit.excuteString === TOKEN_GET_ONE) {
      result = relationFilter.filter(result);
    }
    if (paramParser.modelUnit.excuteString === TOKEN_GET_MANY) {
      for (let i = 0; i < result.length; i++) {
        result[i] = relationFilter.filter(result[i]);
      }
    }
  }
  return result;
}
