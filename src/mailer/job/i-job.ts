import { JobOwner } from './job-owner';

export interface IJob {
  jobOwner: JobOwner;

  start(): void | Promise<void>;
  abort(): void;
  continue(): void;
}
