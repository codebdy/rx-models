import { MailConfig } from 'src/entity-interface/MailConfig';

export const MAILER_EVENT_NAME = 'mailerEvent';

export enum MailerEventType {
  error = 'error',
  progress = 'progress',
  finished = 'finished',
  aborted = 'aborted',
}

export interface MailerEvent {
  type: MailerEventType;
  message?: string;
  progress?: number;
  buffer?: number;
  mailConfig?: MailConfig;
}
