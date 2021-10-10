import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';

export class PostEntitySendMailDirective extends PostDirective {
  static description = `发送邮件，格式sendMail(id?)`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_ENTITY_DIRECTIVE;

  static directiveName = 'sendMail';


}
