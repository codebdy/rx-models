import { MagicService } from 'magic-meta/magic.service';
import { DirectiveType } from '../directive-type';
import { DirectiveMeta } from '../directive.meta';
import { DeleteDirective } from './delete.directive';

export interface DeleteDirectiveClass extends Function {
  description?: string;
  version?: string;

  directiveType: DirectiveType;
  directiveName: string;
  new (
    directiveMeta: DirectiveMeta,
    magicService: MagicService,
  ): DeleteDirective;
}
