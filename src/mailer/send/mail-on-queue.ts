export enum SendStatus {
  sending = 'sending',
  waiting = 'waiting',
  error = 'error',
}

export interface MailOnQueue {
  mailId: number;
  mailSubject: string;
  details?: string;
  status: SendStatus;
  canCancel?: boolean;
}
