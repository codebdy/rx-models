import { Mail } from './Mail';
import { Label } from './Label';
import { RxUser } from './RxUser';

export const EntityMailLabel = 'MailLabel';
export interface MailLabel extends Label {
  id?: number;
  owner?: RxUser;
  attachesTo?: Mail[];
}
