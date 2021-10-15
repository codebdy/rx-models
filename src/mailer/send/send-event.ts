export const MAILER_EVENT_NAME = 'mailerEvent';

export enum MailerSendEventType {
  error = 'error',
  checkStorage = 'checkStorage',
  readLocalMailList = 'readLocalMailList',
  connect = 'connect',
  invalidState = 'invalidState',
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
  openMailBox = 'openMailBox',
  receivedOneMailToInbox = 'receivedOneMailToInbox',
  receivedOneMailToSpam = 'receivedOneMailToSpam',
  sentOneMail = 'sentOneMail',
  sendQueue = 'sendQueue',
}

export interface MailerSendEvent {
  type: MailerSendEventType;
  message?: string;
  total?: number;
  current?: number;
  size?: number;
  mailAddress?: string;
  name?: string;
  subject?: string;
}
