import { RxUser } from './RxUser';
import { RxAbility } from './RxAbility';

export interface RxRole {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: RxUser[];
  abilities?: RxAbility[];
}
