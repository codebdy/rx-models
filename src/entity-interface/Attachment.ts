import { RxMedia } from './RxMedia';
import { Mail } from './Mail';

export const EntityAttachment = 'Attachment';
export interface Attachment {
  id?: number;
  belongsTo?: Mail;
  file?: RxMedia;
}
