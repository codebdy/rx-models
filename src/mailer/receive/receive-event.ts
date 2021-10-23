import { MailBoxType } from "src/entity-interface/MailBoxType";

export enum MailerReceiveEventType {
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
  receivedOneMail = 'receivedOneMail',
}

export interface MailerReceiveEvent {
  type: MailerReceiveEventType;
  message?: string;
  total?: number;
  current?: number;
  size?: number;
  mailAddress?: string;
  name?: string;
  subject?: string;
  inMailbox?: MailBoxType;
}
