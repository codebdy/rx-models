import { AddressItem } from 'src/entity-interface/AddressItem';
import { IJob } from '../job/i-job';
import { JobOwner } from '../job/job-owner';

enum SendStatus {
  finished = 'finished',
  sending = 'sending',
  error = 'error',
}

type AddressItemWithStatus = AddressItem & {
  status?: SendStatus;
};
export class SendJob implements IJob {
  jobOwner: JobOwner;
  to?: AddressItemWithStatus;

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
