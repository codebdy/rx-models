import { Injectable } from '@nestjs/common';
import { DirectiveStorage } from './directivestorage';
import { DeleteDirectiveClass } from './delete/delete.directive.class';

@Injectable()
export class DeleteDirectiveService {
  constructor(private readonly directiveStorage: DirectiveStorage) {}

  findCommandOrFailed(name: string): DeleteDirectiveClass {
    const directiveClass = this.directiveStorage.deleteDirectiveClasses[name];
    if (!directiveClass) {
      throw new Error(`No delete command "${name}"`);
    }
    return directiveClass;
  }
}
