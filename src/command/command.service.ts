import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandType } from './query-command';
import { CommandClass } from './command.class';
import { ConditionCommandClass } from './command.class.condition';
import { RelationCommandClass } from './command.class.relation';

@Injectable()
export class CommandService implements OnModuleInit {
  modelCommandClasses: { [key: string]: CommandClass } = {} as any;
  relationCommandClasses: { [key: string]: CommandClass } = {} as any;
  conditionCommandClasses: { [key: string]: CommandClass } = {} as any;

  findModelCommandOrFailed(name: string): CommandClass {
    const commandClass = this.modelCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No model command "${name}"`);
    }
    return commandClass;
  }

  findRelationCommandOrFailed(name: string): RelationCommandClass {
    const commandClass = this.relationCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No relation command "${name}"`);
    }
    return commandClass;
  }

  findConditionCommandOrFailed(name: string): ConditionCommandClass {
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
    const commandClasses: CommandClass[] = importCommandsFromDirectories([
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
