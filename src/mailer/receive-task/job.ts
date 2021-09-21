import { MailerEvent, MailerEventType } from '../mailer.event';
import { JobOwner } from './job-owner';

export interface IJob {
  jobOwner: JobOwner;

  start(): void;
  abort(): void;
  retry(): void;
}

export abstract class Job implements IJob {
  jobOwner: JobOwner;
  protected mailAddress: string;
  protected isError = false;
  protected eventName = '';
  constructor(enventName: string) {
    this.eventName = enventName;
  }

  emit(event: MailerEvent): void {
    event.name = this.eventName;
    this.jobOwner.emit(event);
  }

  error(message: string) {
    this.emit({
      type: MailerEventType.error,
      message: message,
    });
    this.isError = true;
  }
  abstract start(): void;
  abstract abort(): void;
  abstract retry(): void;
}
