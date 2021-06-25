import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandClass, CommandType } from './magic-command';

@Injectable()
export class CommandService implements OnModuleInit {
  private qbCommandClasses: { [key: string]: CommandClass } = {} as any;

  async onModuleInit() {
    await this.loadCommandClasses();
  }

  async loadCommandClasses() {
    const commandClasses: CommandClass[] = importCommandsFromDirectories([
      'dist/commands/*/*.js',
    ]);
    commandClasses.forEach((commandClass) => {
      if (commandClass.commandType === CommandType.QUERY_BUILDER_COMMAND) {
        console.assert(
          !this.qbCommandClasses[commandClass.commandName],
          `Command ${commandClass.commandName} duplicated!`,
        );
        this.qbCommandClasses[commandClass.commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
