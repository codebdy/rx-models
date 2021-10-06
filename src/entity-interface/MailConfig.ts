import { RxUser } from './RxUser';
import { MailReceiveConfig } from './MailReceiveConfig';
import { SmtpConfig } from './SmtpConfig';

export const EntityMailConfig = 'MailConfig';
export interface MailConfig  {
  id?: number;
  address: string;
  password?: string;
  pop3?: MailReceiveConfig;
  imap4?: MailReceiveConfig;
  smtp?: SmtpConfig;
  interval?: number;
  stop?: boolean;
  receiveInterval?: boolean;
  sendName?: string;
  belongsTo?: RxUser;
}
