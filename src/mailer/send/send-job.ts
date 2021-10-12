import { IJob } from '../job/i-job';
import { JobOwner } from '../job/job-owner';

export class SendJob implements IJob {
  jobOwner: JobOwner;

  start(): void {
    throw new Error('Method not implemented.');
  }
  abort(): void {
    throw new Error('Method not implemented.');
  }
  continue(): void {
    throw new Error('Method not implemented.');
  }
}
