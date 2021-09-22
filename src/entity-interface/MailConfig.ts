import { RxUser } from './RxUser';
import { MailReceiveConfig } from './MailReceiveConfig';


export const EntityMailConfig = 'MailConfig';
export interface MailConfig  {
  id?: number;
  address: string;
  password?: string;
  pop3?: MailReceiveConfig;
  imap4?: MailReceiveConfig;
  smtp?: any;
  interval?: number;
  stop?: boolean;
  receiveInterval?: boolean;
  belongsTo?: RxUser;
}
