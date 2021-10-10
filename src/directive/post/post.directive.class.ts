import { MagicService } from 'src/magic-meta/magic.service';
import { MailerSendService } from 'src/mailer/mailer.send-service';
import { DirectiveType } from '../directive-type';
import { DirectiveMeta } from '../directive.meta';
import { PostDirective } from './post.directive';

export interface PostDirectiveClass extends Function {
  description?: string;
  version?: string;

  directiveType: DirectiveType;
  directiveName: string;
  new (
    directiveMeta: DirectiveMeta,
    magicService: MagicService,
    mailerSendService: MailerSendService,
  ): PostDirective;
}
