import { RxMediaFolder } from './RxMediaFolder';
import { RxUser } from './RxUser';
import { Attachment } from './Attachment';

export const EntityRxMedia = 'RxMedia';

export interface RxMedia {
  id?: number;
  name: string;
  mimetype?: string;
  fileName?: string;
  path?: string;
  size?: number;
  user?: RxUser;
  avatarOfUser?: RxUser;
  asMailAttachment?: Attachment;
  folder?: RxMediaFolder;
}
