import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandType } from './query-command';
import { CommandClass } from './command.class';

@Injectable()
export class CommandService implements OnModuleInit {
  private modelCommandClasses: { [key: string]: CommandClass } = {} as any;
  private relationCommandClasses: { [key: string]: CommandClass } = {} as any;
  private conditionCommandClasses: { [key: string]: CommandClass } = {} as any;

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
      if (commandClass.commandType === CommandType.QUERY_MODEL_COMMAND) {
        console.assert(
          !this.modelCommandClasses[commandClass.commandName],
          `Model command ${commandClass.commandName} duplicated!`,
        );
        this.modelCommandClasses[commandClass.commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_RELATION_COMMAND) {
        console.assert(
          !this.relationCommandClasses[commandClass.commandName],
          `Relation command ${commandClass.commandName} duplicated!`,
        );
        this.relationCommandClasses[commandClass.commandName] = commandClass;
      }

      if (commandClass.commandType === CommandType.QUERY_CONDITION_COMMAND) {
        console.assert(
          !this.conditionCommandClasses[commandClass.commandName],
          `Condition command ${commandClass.commandName} duplicated!`,
        );
        this.conditionCommandClasses[commandClass.commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
