import { ISendJob } from './i-send-job';

export interface ISendJobOwner {
  nextJob(): ISendJob;
  finishJob(): void;
  onQueueChange(): void;
}
