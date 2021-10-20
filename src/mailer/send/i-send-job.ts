import { ISendJobOwner } from './i-send-job-owner';
import { MailOnQueue } from './mail-on-queue';

export interface ISendJob {
  jobOwner: ISendJobOwner;

  start(): void | Promise<void>;
  abort(): void;
  toQueueItem(): MailOnQueue;
}
