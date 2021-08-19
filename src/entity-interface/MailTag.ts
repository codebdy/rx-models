import { Mail } from './Mail';

export const EntityMailTag = 'MailTag';

export interface MailTag {
  id?: number;
  color?: string;
  name?: string;
  beMetMails?: Mail[];
}
