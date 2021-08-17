import { JobOwner } from './job-owner';

export interface Job {
  jobOwner: JobOwner;
  start(): void;
  abort(): void;
  retry(): void;
}
