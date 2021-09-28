import { RxMediaFolder } from './RxMediaFolder';
import { RxUser } from './RxUser';
import { RxTemplate } from './RxTemplate';
import { Attachment } from './Attachment';
import { Customer } from './Customer';
import { CustomerContact } from './CustomerContact';
import { RxMediaType } from './RxMediaType';

export const EntityRxMedia = 'RxMedia';
export interface RxMedia  {
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
  user?: RxUser;
  mediaOfTemplate?: RxTemplate;
  fileOfAttachment?: Attachment;
  logoOfCustomer?: Customer;
  avatarOfCustomerContact?: CustomerContact;
  folder?: RxMediaFolder;
}
