import { IJob } from '../job/i-job';
import { MailOnQueue } from './mail-on-queue';

export interface ISendJob extends IJob {
  toQueueItem(): MailOnQueue;
}
