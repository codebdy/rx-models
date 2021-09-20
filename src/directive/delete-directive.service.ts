import { Injectable } from '@nestjs/common';
import { DirectiveStorage } from './directive.storage';
import { DeleteDirectiveClass } from './delete/delete.directive.class';

@Injectable()
export class DeleteDirectiveService {
  constructor(private readonly directiveStorage: DirectiveStorage) {}

  findDirectiveOrFailed(name: string): DeleteDirectiveClass {
    const directiveClass = this.directiveStorage.deleteDirectiveClasses[name];
    if (!directiveClass) {
      throw new Error(`No delete directive "${name}"`);
    }
    return directiveClass;
  }
}
