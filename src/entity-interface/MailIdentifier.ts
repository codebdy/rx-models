import { Mail } from './Mail';

export const EntityMailIdentifier = 'MailIdentifier';
export interface MailIdentifier {
  id?: number;
  uidl?: string;
  mailAddress?: string;
  file?: string;
  mail?: Mail;
}
