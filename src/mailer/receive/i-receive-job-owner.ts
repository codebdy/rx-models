import { MailerReceiveEvent } from './receive-event';
import { IReceiveJob } from './i-receive-job';

export interface IReceiveJobOwner {
  nextJob(): IReceiveJob;
  finishJob(): void;
  emit(event: MailerReceiveEvent): void;
}
