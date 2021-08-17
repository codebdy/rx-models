import { MailConfig } from 'src/entity-interface/MailConfig';
import { MailerEvent } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';
import { Pop3Job } from './pop3-job';

export class MailAddressJob implements Job, JobOwner {
  private jobs: Job[] = [];
  jobOwner: JobOwner;
  private currentJob: Job;
  constructor(private readonly config: MailConfig) {
    if (!config.pop3?.stop) {
      this.jobs.push(new Pop3Job(config.pop3));
    }
  }

  start() {
    this.nextJob()?.start();
  }

  nextJob(): Job {
    if (this.jobs.length === 0) {
      this.jobOwner.finishJob();
      return;
    }
    this.currentJob = this.jobs.pop();
    return this.currentJob;
  }

  finishJob(): void {
    this.nextJob()?.start();
  }

  emit(event: MailerEvent): void {
    this.jobOwner.emit(event);
  }

  abort(): void {
    this.currentJob?.abort();
    this.jobs = [];
  }
}
