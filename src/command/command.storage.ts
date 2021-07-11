import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandType } from './command-type';
import { QueryCommandClass } from './query/query.command.class';

@Injectable()
export class CommandStorage implements OnModuleInit {
  queryEntityCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  queryRelationCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  queryConditionCommandClasses: {
    [key: string]: QueryCommandClass;
  } = {} as any;

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
      if (commandClass.commandType === CommandType.QUERY_ENTITY_COMMAND) {
        console.assert(
          !this.queryEntityCommandClasses[commandName],
          `Model command ${commandName} duplicated!`,
        );
        this.queryEntityCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_RELATION_COMMAND) {
        console.assert(
          !this.queryRelationCommandClasses[commandName],
          `Relation command ${commandName} duplicated!`,
        );
        this.queryRelationCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_CONDITION_COMMAND) {
        console.assert(
          !this.queryConditionCommandClasses[commandName],
          `Condition command ${commandName} duplicated!`,
        );
        this.queryConditionCommandClasses[commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
