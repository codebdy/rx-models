import { Mail } from './Mail';

export const EntityAttachment = 'Attachment';
export interface Attachment  {
  id?: number;
  fileName?: string;
  mimeType?: string;
  path?: string;
  size?: number;
  belongsTo?: Mail;
}
