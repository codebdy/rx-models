import { RxUser } from './RxUser';
import { RxAbility } from './RxAbility';
import { RxDepartment } from './RxDepartment';

export const EntityRxRole = 'RxRole';
export interface RxRole  {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: RxUser[];
  abilities?: RxAbility[];
  belongsToDepartment?: RxDepartment;
}
