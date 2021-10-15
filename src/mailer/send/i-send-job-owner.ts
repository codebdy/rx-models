import { ISendJob } from './i-send-job';
import { MailerSendEvent } from './send-event';

export interface ISendJobOwner {
  nextJob(): ISendJob;
  finishJob(): void;
  emit(event: MailerSendEvent): void;
  onQueueChange(): void;
  onErrorJob(job: ISendJob): void;
}
