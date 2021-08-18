import { RxRole } from './RxRole';
import { RxMedia } from './RxMedia';
import { RxMediaFolder } from './RxMediaFolder';
import { MailConfig } from './MailConfig';
import { Mail } from './Mail';

export const EntityRxUser = 'RxUser';

export interface RxUser {
  id?: number;
  name: string;
  loginName: string;
  email?: string;
  isSupper?: boolean;
  isDemo?: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: RxRole[];
  medias?: RxMedia[];
  mediaFolders?: RxMediaFolder[];
  avatar?: RxMedia;
  mailConfigs?: MailConfig[];
  mails?: Mail[];
}
