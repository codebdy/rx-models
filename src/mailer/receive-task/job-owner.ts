import { MailerEvent } from '../mailer.event';
import { Job } from './job';

export interface JobOwner {
  nextJob(): Job;
  finishJob(): void;
  emit(event: MailerEvent): void;
}
