import { Injectable } from '@nestjs/common';
import { CommandStorage } from './command.storage';
import { PostCommandClass } from './post/post.command.class';

@Injectable()
export class PostCommandService {
  constructor(private readonly commandStorage: CommandStorage) {}

  findEntityCommandOrFailed(name: string): PostCommandClass {
    const commandClass = this.commandStorage.postEntityCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No entity command "${name}"`);
    }
    return commandClass;
  }

  findRelationCommandOrFailed(name: string): PostCommandClass {
    const commandClass = this.commandStorage.postRelationCommandClasses[name];
    if (!commandClass) {
      throw new Error(`No relation command "${name}"`);
    }
    return commandClass;
  }
}
