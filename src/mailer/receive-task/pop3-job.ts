import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { Job } from './job';
import { JobOwner } from './job-owner';
const POP3Client = require('poplib');

export class Pop3Job implements Job {
  private isAborted = false;
  jobOwner: JobOwner;
  constructor(private readonly pop3Config: MailReceiveConfig) {}

  abort(): void {
    this.isAborted = true;
  }

  start(): void {
    console.log('哈哈', this.pop3Config);
  }
}
