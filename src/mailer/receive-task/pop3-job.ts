import { Job } from './job';
import { JobOwner } from './job-owner';

export class Pop3Job implements Job {
  private isAborted = false;
  jobOwner: JobOwner;

  start(): void {
    throw new Error('Method not implemented.');
  }

  abort(): void {
    this.isAborted = true;
  }
}
