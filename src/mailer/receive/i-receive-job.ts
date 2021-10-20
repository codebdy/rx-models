import { IReceiveJobOwner } from './i-receive-job-owner';

export interface IReceiveJob {
  jobOwner: IReceiveJobOwner;

  start(): void | Promise<void>;
  abort(): void;
  //continue(): void;
}
