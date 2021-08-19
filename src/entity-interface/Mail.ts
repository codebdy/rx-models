import { Attachment } from './Attachment';
import { MailIdentifier } from './MailIdentifier';
import { RxUser } from './RxUser';
import { MailTag } from './MailTag';
import { MailBoxType } from './MailBoxType';


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
  readFlag?: boolean;
  isTop?: string;
  inMailBox?: MailBoxType;
  belongsTo?: RxUser;
  tags?: MailTag[];
  attachments?: Attachment[];
  identifier?: MailIdentifier;
}
