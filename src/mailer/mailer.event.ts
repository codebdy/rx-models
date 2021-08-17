export const MAILER_EVENT_NAME = 'mailerEvent';

export enum MailerEventType {
  error = 'error',
  connect = 'connect',
  invalidState = 'invalid-state',
  locked = 'locked',
  login = 'login',
  list = 'list',
  uidl = 'uidl',
  retr = 'retr',
  dele = 'dele',
  quit = 'quit',
  progress = 'progress',
  cancelling = 'cancelling',
  finished = 'finished',
  aborted = 'aborted',
}

export interface MailerEvent {
  type: MailerEventType;
  message?: string;
  progress?: number;
  buffer?: number;
  mailAddress?: string;
  name?: string;
}
