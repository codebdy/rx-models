export const MAILER_EVENT_NAME = 'mailerEvent';

export enum MailerEventType {
  error = 'error',
  checkStorage = 'checkStorage',
  readLocalMailList = 'readLocalMailList',
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
  total?: number;
  current?: number;
  size?: number;
  mailAddress?: string;
  name?: string;
}
