import { RxMedia } from './RxMedia';
import { Mail } from './Mail';

export const EntityDraftAttachment = 'DraftAttachment';
export interface DraftAttachment  {
  id?: number;
  belongsTo?: Mail;
  rxMedia?: RxMedia;
}
