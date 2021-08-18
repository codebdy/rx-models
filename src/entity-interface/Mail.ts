import { Attachment } from './Attachment';
import { RxMedia } from './RxMedia';
import { MailIdentifier } from './MailIdentifier';
import { RxUser } from './RxUser';

export const EntityMail = 'Mail';

export interface Mail {
  id?: number;
  subject?: string;
  from?: string;
  to?: any[];
  text?: string;
  html?: string;
  receivedAt?: Date;
  belongsTo?: RxUser;
  attachments?: Attachment[];
  emlFile?: RxMedia;
  identifier?: MailIdentifier;
}
