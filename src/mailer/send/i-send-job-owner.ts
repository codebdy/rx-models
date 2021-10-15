import { IJobOwner } from '../job/i-job-owner';

export interface ISendJobOwner extends IJobOwner {
  onQueueChange(): void;
}
