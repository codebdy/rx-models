export const MAILER_EVENT_NAME = 'mailerEvent';

export enum MailerEventType {
  error = 'error',
  connect = 'connect',
  invalidState = 'invalid-state',
  locked = 'locked',
  login = 'login',
  list = 'list',
  retr = 'retr',
  dele = 'dele',
  quit = 'quit',
  progress = 'progress',
  finished = 'finished',
  aborted = 'aborted',
}

export interface MailerEvent {
  type: MailerEventType;
  message?: string;
  progress?: number;
  buffer?: number;
  mailAddress?: string;
}
