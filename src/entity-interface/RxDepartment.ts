import { RxUser } from './RxUser';
import { RxRole } from './RxRole';

export const EntityRxDepartment = 'RxDepartment';
export interface RxDepartment  {
  id?: number;
  name: string;
  desctiption?: string;
  uuid?: string;
  hasUsers?: RxUser[];
  roles?: RxRole[];
}
