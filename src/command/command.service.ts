import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandType } from './query-command';
import { CommandClass } from './command.class';

@Injectable()
export class CommandService implements OnModuleInit {
  modelCommandClasses: { [key: string]: CommandClass } = {} as any;
  relationCommandClasses: { [key: string]: CommandClass } = {} as any;
  conditionCommandClasses: { [key: string]: CommandClass } = {} as any;

  async onModuleInit() {
    await this.loadCommandClasses();
  }

  async loadCommandClasses() {
    const commandClasses: CommandClass[] = importCommandsFromDirectories([
      'dist/commands/*.js',
      'dist/commands/*/*.js',
      'commands/*.js',
      'commands/*/*.js',
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
