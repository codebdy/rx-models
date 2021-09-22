import { Mail } from './Mail';
import { MailBoxType } from './MailBoxType';

export const EntityMailIdentifier = 'MailIdentifier';
export interface MailIdentifier  {
  id?: number;
  uidl: string;
  mailAddress: string;
  file: string;
  fromBox: MailBoxType;
  mail?: Mail;
}
