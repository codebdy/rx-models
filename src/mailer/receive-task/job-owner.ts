import { MailerEvent } from '../mailer.event';
import { IJob } from './job';

export interface JobOwner {
  nextJob(): IJob;
  finishJob(): void;
  emit(event: MailerEvent): void;
}
