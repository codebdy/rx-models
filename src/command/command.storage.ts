import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandType } from './command-type';
import { PostCommandClass } from './post/post.command.class';
import { QueryCommandClass } from './query/query.command.class';

@Injectable()
export class CommandStorage implements OnModuleInit {
  queryEntityCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  queryRelationCommandClasses: { [key: string]: QueryCommandClass } = {} as any;
  queryConditionCommandClasses: {
    [key: string]: QueryCommandClass;
  } = {} as any;

  postEntityCommandClasses: { [key: string]: PostCommandClass } = {} as any;
  postRelationCommandClasses: { [key: string]: PostCommandClass } = {} as any;

  async onModuleInit() {
    await this.loadCommandClasses();
  }

  async loadCommandClasses() {
    const commandClasses:
      | QueryCommandClass[]
      | PostCommandClass[] = importCommandsFromDirectories([
      'dist/commands/*.js',
      'commands/*.js',
    ]);
    commandClasses.forEach((commandClass) => {
      const commandName = commandClass.commandName;
      if (commandClass.commandType === CommandType.QUERY_ENTITY_COMMAND) {
        console.assert(
          !this.queryEntityCommandClasses[commandName],
          `Query entity command ${commandName} duplicated!`,
        );
        this.queryEntityCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_RELATION_COMMAND) {
        console.assert(
          !this.queryRelationCommandClasses[commandName],
          `Query relation command ${commandName} duplicated!`,
        );
        this.queryRelationCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_CONDITION_COMMAND) {
        console.assert(
          !this.queryConditionCommandClasses[commandName],
          `Query condition command ${commandName} duplicated!`,
        );
        this.queryConditionCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.POST_ENTITY_COMMAND) {
        console.assert(
          !this.postEntityCommandClasses[commandName],
          `Post entity command ${commandName} duplicated!`,
        );
        this.postEntityCommandClasses[commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.POST_RELATION_COMMAND) {
        console.assert(
          !this.postRelationCommandClasses[commandName],
          `Post relation command ${commandName} duplicated!`,
        );
        this.postRelationCommandClasses[commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
