import { Attachment } from './Attachment';
import { MailIdentifier } from './MailIdentifier';
import { RxUser } from './RxUser';
import { MailLabel } from './MailLabel';
import { MailBoxType } from './MailBoxType';
import { AddressObject } from './AddressObject';


export const EntityMail = 'Mail';
export interface Mail  {
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
  inMailBox: MailBoxType;
  finished?: boolean;
  showAsOriginal?: boolean;
  fromAddress?: string;
  seen?: boolean;
  answered?: boolean;
  flagged?: boolean;
  deleted?: boolean;
  draft?: boolean;
  forwarded?: boolean;
  spam?: boolean;
  fromOldCustomer?: boolean;
  owner?: RxUser;
  labels?: MailLabel[];
  attachments?: Attachment[];
  identifier?: MailIdentifier;
}
