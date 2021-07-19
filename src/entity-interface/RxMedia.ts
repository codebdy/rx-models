import { RxMediaFolder } from './RxMediaFolder';
import { RxUser } from './RxUser';

export interface RxMedia {
  id?: number;
  name: string;
  mimetype?: string;
  fileName?: string;
  path?: string;
  size?: number;
  user?: RxUser;
  avatarOfUser?: RxUser;
  folder?: RxMediaFolder;
}
