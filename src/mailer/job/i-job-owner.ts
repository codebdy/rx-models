import { IJob } from './i-job';
import { MailerEvent } from '../mailer.event';

export interface IJobOwner {
  nextJob(): IJob;
  finishJob(): void;
  emit(event: MailerEvent): void;
}
