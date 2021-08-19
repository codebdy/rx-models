import { Attachment } from './Attachment';
import { MailIdentifier } from './MailIdentifier';
import { RxUser } from './RxUser';


export const EntityMail = 'Mail';

export interface Mail {
  id?: number;
  subject?: string;
  from?: any;
  to?: any;
  cc?: any;
  bcc?: any;
  date?: Date;
  messageId?: string;
  inReplyTo?: string;
  replyTo?: any;
  references?: any[];
  html?: string;
  text?: string;
  textAsHtml?: string;
  priority?: string;
  belongsTo?: RxUser;
  attachments?: Attachment[];
  identifier?: MailIdentifier;
}
