import { MailConfig } from 'src/entity-interface/MailConfig';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailerEvent } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';
import { Pop3Job } from './pop3-job';

export class MailAddressJob implements Job, JobOwner {
  private jobs: Job[] = [];
  private currentJob: Job;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly config: MailConfig,
    public readonly jobOwner: JobOwner,
  ) {
    if (config.pop3 && !config.pop3?.stop) {
      this.jobs.push(
        new Pop3Job(this.typeOrmService, config.address, config.pop3, this),
      );
    }
  }
  start() {
    this.nextJob()?.start();
  }

  retry(): void {
    this.currentJob?.retry();
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
    event.mailAddress = this.config.address;
    this.jobOwner.emit(event);
  }

  abort(): void {
    this.currentJob?.abort();
    this.jobs = [];
  }
}
