import { MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailerEvent } from '../mailer.event';
import { Imap4Job } from './imap4-job';
import { IJob } from '../job';
import { Pop3Job } from './pop3-job';
import { JobOwner } from '../job-owner';

export class MailAddressJob implements IJob, JobOwner {
  private jobs: IJob[] = [];
  private currentJob: IJob;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly config: MailConfig,
    public readonly jobOwner: JobOwner,
    private readonly accountId: number,
  ) {
    if (
      config.pop3?.account &&
      config.pop3?.host &&
      config.pop3.host &&
      config.pop3.password &&
      !config.stop
    ) {
      this.jobs.push(
        new Pop3Job(
          typeOrmService,
          storageService,
          config.address,
          config.pop3,
          this,
          this.accountId,
        ),
      );
    }
    if (
      config.imap4?.account &&
      config.imap4?.host &&
      config.imap4.host &&
      config.imap4.password &&
      !config.stop
    ) {
      this.jobs.push(
        new Imap4Job(
          typeOrmService,
          storageService,
          config.address,
          config.imap4,
          this,
          this.accountId,
        ),
      );
    }
  }
  start() {
    this.nextJob()?.start();
  }

  continue(): void {
    this.currentJob?.continue();
  }

  nextJob(): IJob {
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
