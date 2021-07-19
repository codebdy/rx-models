import { RxMedia } from './RxMedia';
import { RxUser } from './RxUser';

export interface RxMediaFolder {
  id?: number;
  name: string;
  order?: string;
  parent?: RxMediaFolder;
  medias?: RxMedia[];
  user?: RxUser;
  children?: RxMediaFolder[];
}
