import { Injectable } from '@nestjs/common';
import { QueryDirectiveClass } from './query/query.directive.class';
import { QueryConditionDirectiveClass } from './query/query.condition-directive-class';
import { QueryRelationDirectiveClass } from './query/query.relation-directive-class';
import { DirectiveStorage } from './directivestorage';

@Injectable()
export class QueryDirectiveService {
  constructor(private readonly directiveStorage: DirectiveStorage) {}

  findEntityDirectiveOrFailed(name: string): QueryDirectiveClass {
    const directiveClass = this.directiveStorage.queryEntityDirectiveClasses[
      name
    ];
    if (!directiveClass) {
      throw new Error(`No entity directive "${name}"`);
    }
    return directiveClass;
  }

  findRelationDirectiveOrFailed(name: string): QueryRelationDirectiveClass {
    const directiveClass = this.directiveStorage.queryRelationDirectiveClasses[
      name
    ];
    if (!directiveClass) {
      throw new Error(`No relation directive "${name}"`);
    }
    return directiveClass;
  }

  findConditionDirectiveOrFailed(name: string): QueryConditionDirectiveClass {
    const directiveClass = this.directiveStorage.queryConditionDirectiveClasses[
      name
    ];
    if (!directiveClass) {
      throw new Error(`No condition directive "${name}"`);
    }
    return directiveClass;
  }
}
