import { Injectable, OnModuleInit } from '@nestjs/common';
import { importCommandsFromDirectories } from 'src/util/DirectoryExportedCommandsLoader';
import { CommandClass, CommandType } from './magic-command';

@Injectable()
export class CommandService implements OnModuleInit {
  private qbCommands: { [key: string]: CommandClass } = {} as any;

  async onModuleInit() {
    const commandClasses: CommandClass[] = importCommandsFromDirectories([
      'dist/commands/*.js',
    ]);
    commandClasses.forEach((commandClass) => {
      if (commandClass.commandType === CommandType.QUERY_BUILDER_COMMAND) {
        console.assert(
          !this.qbCommands[commandClass.commandName],
          `Command ${commandClass.commandName} duplicated!`,
        );
        this.qbCommands[commandClass.commandName] = commandClass;
      }
    });
    console.debug('Commands loaded');
  }
}
