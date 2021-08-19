import { Attachment } from './Attachment';
import { MailIdentifier } from './MailIdentifier';
import { RxUser } from './RxUser';
import { MailTag } from './MailTag';
import { MailBoxType } from './MailBoxType';
import { AddressObject } from './AddressObject';


export const EntityMail = 'Mail';
export interface Mail {
  id?: number;
  subject?: string;
  from?: AddressObject;
  to?: AddressObject;
  cc?: AddressObject;
  bcc?: AddressObject;
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
  finished?: boolean;
  fromAddress?: string;
  belongsTo?: RxUser;
  tags?: MailTag[];
  attachments?: Attachment[];
  identifier?: MailIdentifier;
}
