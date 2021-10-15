import { IJobOwner } from './i-job-owner';

export interface IJob {
  jobOwner: IJobOwner;

  start(): void | Promise<void>;
  abort(): void;
  //continue(): void;
}
