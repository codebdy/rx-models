import { SendStatus } from 'src/entity-interface/SendStatus';

export interface MailOnQueue {
  mailId: number;
  mailSubject: string;
  details?: string;
  status: SendStatus;
  canCancel?: boolean;
}
