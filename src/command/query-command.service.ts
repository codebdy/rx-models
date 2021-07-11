import { Injectable } from '@nestjs/common';
import { QueryCommandClass } from './query/query.command.class';
import { QueryConditionCommandClass } from './query/query.condition-command-class';
import { QueryRelationCommandClass } from './query/query.relation-command-class';
import { CommandStorage } from './command.storage';

@Injectable()
export class QueryCommandService {
  constructor(private readonly commandStorage: CommandStorage) {}

  findModelCommandOrFailed(name: string): QueryCommandClass {
    const commandClass = this.commandStorage.queryEntityCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No entity command "${name}"`);
    }
    return commandClass;
  }

  findRelationCommandOrFailed(name: string): QueryRelationCommandClass {
    const commandClass = this.commandStorage.queryRelationCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No relation command "${name}"`);
    }
    return commandClass;
  }

  findConditionCommandOrFailed(name: string): QueryConditionCommandClass {
    const commandClass = this.commandStorage.queryConditionCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No condition command "${name}"`);
    }
    return commandClass;
  }
}
