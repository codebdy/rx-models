import { RxRole } from "./rx-role";

export interface RxUser {
  id?: number;
  loginName: string;
  email?: string;
  name?: string;
  password: string;
  isSupper?: boolean;
  isDemo?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: RxRole[];
}
