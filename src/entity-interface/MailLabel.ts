import { Mail } from './Mail';

export const EntityMailLabel = 'MailLabel';
export interface MailLabel  {
  id?: number;
  color: string;
  name: string;
  attachesTo?: Mail[];
}
