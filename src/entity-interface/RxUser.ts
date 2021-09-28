import { RxRole } from './RxRole';
import { RxMedia } from './RxMedia';
import { RxMediaFolder } from './RxMediaFolder';
import { MailConfig } from './MailConfig';
import { Mail } from './Mail';
import { MailLabel } from './MailLabel';
import { CustomerLabel } from './CustomerLabel';
import { Customer } from './Customer';
import { RxDepartment } from './RxDepartment';
import { RxUserStatus } from './RxUserStatus';

export const EntityRxUser = 'RxUser';
export interface RxUser  {
  id?: number;
  name: string;
  loginName: string;
  email?: string;
  password: string;
  isSupper?: boolean;
  isDemo?: boolean;
  status?: RxUserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  belongsToDeparments?: RxDepartment[];
  roles?: RxRole[];
  avatar?: RxMedia;
  mediaFolders?: RxMediaFolder[];
  medias?: RxMedia[];
  mailConfigs?: MailConfig[];
  mails?: Mail[];
  mailLabels?: MailLabel[];
  customerLabels?: CustomerLabel[];
  customers?: Customer[];
}
