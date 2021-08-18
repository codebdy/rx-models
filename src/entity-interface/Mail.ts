import { Attachment } from './Attachment';
import { RxUser } from './RxUser';

export const EntityMail = 'Mail';

export interface Mail {
  id?: number;
  uidl: string;
  mailAddress: string;
  subject?: string;
  from?: string;
  to?: any[];
  text?: string;
  html?: string;
  receivedAt?: Date;
  belongsTo?: RxUser;
  attachments?: Attachment[];
}
