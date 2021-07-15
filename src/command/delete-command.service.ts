import { Injectable } from '@nestjs/common';
import { CommandStorage } from './command.storage';
import { DeleteCommandClass } from './delete/delete.command.class';

@Injectable()
export class DeleteCommandService {
  constructor(private readonly commandStorage: CommandStorage) {}

  findCommandOrFailed(name: string): DeleteCommandClass {
    const commandClass = this.commandStorage.deleteCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No delete command "${name}"`);
    }
    return commandClass;
  }
}
