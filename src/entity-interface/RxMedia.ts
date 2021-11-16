import { RxMediaFolder } from './RxMediaFolder';
import { RxUser } from './RxUser';
import { RxMediaType } from './RxMediaType';

export const EntityRxMedia = 'RxMedia';
export interface RxMedia {
  id?: number;
  name: string;
  mimetype?: string;
  fileName?: string;
  path?: string;
  size?: number;
  updatedAt?: Date;
  createdAt?: Date;
  mediaType?: RxMediaType;
  avatarOfUser?: RxUser;
  owner?: RxUser;
  folder?: RxMediaFolder;
}
