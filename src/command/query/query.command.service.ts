import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { QueryCommandClass } from './query.command.class';
import { QueryConditionCommandClass } from './query.condition-command-class';
import { QueryRelationCommandClass } from './query.relation-command-class';
import { CommandType } from './query.command';

@Injectable()
export class QueryCommandService implements OnModuleInit {
  modelCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  relationCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  conditionCommandClasses: { [key: string]: QueryCommandClass } = {} as any;

  findModelCommandOrFailed(name: string): QueryCommandClass {
    const commandClass = this.modelCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No model command "${name}"`);
    }
    return commandClass;
  }

  findRelationCommandOrFailed(name: string): QueryRelationCommandClass {
    const commandClass = this.relationCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No relation command "${name}"`);
    }
    return commandClass;
  }

  findConditionCommandOrFailed(name: string): QueryConditionCommandClass {
    const commandClass = this.conditionCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No condition command "${name}"`);
    }
    return commandClass;
  }

  async onModuleInit() {
    await this.loadCommandClasses();
  }

  async loadCommandClasses() {
    const commandClasses: QueryCommandClass[] = importCommandsFromDirectories([
      'dist/commands/*.js',
      'commands/*.js',
    ]);
    commandClasses.forEach((commandClass) => {
      const commandName = commandClass.commandName;
      if (commandClass.commandType === CommandType.QUERY_MODEL_COMMAND) {
        console.assert(
          !this.modelCommandClasses[commandName],
          `Model command ${commandName} duplicated!`,
        );
        this.modelCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_RELATION_COMMAND) {
        console.assert(
          !this.relationCommandClasses[commandName],
          `Relation command ${commandName} duplicated!`,
        );
        this.relationCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_CONDITION_COMMAND) {
        console.assert(
          !this.conditionCommandClasses[commandName],
          `Condition command ${commandName} duplicated!`,
        );
        this.conditionCommandClasses[commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
