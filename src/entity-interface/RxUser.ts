import { RxRole } from './RxRole';
import { RxMedia } from './RxMedia';
import { RxMediaFolder } from './RxMediaFolder';

export interface RxUser {
  id?: number;
  name: string;
  loginName: string;
  email?: string;
  password: string;
  isSupper?: boolean;
  isDemo?: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: RxRole[];
  medias?: RxMedia[];
  mediaFolders?: RxMediaFolder[];
  avatar?: RxMedia;
}
