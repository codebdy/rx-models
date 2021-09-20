import { RxUser } from './RxUser';
import { RxMedia } from './RxMedia';

export const EntityRxMediaFolder = 'RxMediaFolder';
export interface RxMediaFolder  {
  id?: number;
  name: string;
  order?: string;
  parent?: RxMediaFolder;
  user?: RxUser;
  medias?: RxMedia[];
  children?: RxMediaFolder[];
}
