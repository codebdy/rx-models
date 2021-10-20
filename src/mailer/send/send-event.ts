import { MailOnQueue } from './mail-on-queue';

export enum MailerSendEventType {
  sentOneMail = 'sentOneMail',
  sendQueue = 'sendQueue',
}

export interface MailerSendEvent {
  type: MailerSendEventType;
  mailId?: number;
  mailSubject?: string;
  mailsQueue?: MailOnQueue[];
}
