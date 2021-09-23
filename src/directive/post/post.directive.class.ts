import { MagicService } from 'magic-meta/magic.service';
import { DirectiveType } from '../directive-type';
import { DirectiveMeta } from '../directive.meta';
import { PostDirective } from './post.directive';

export interface PostDirectiveClass extends Function {
  description?: string;
  version?: string;

  directiveType: DirectiveType;
  directiveName: string;
  new (directiveMeta: DirectiveMeta, magicService: MagicService): PostDirective;
}
