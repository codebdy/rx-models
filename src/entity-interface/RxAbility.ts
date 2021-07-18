import { RxRole } from './RxRole';

export enum AbilityType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface RxAbility {
  id?: number;
  entityUuid: string;
  columnUuid?: string;
  abilityType: AbilityType;
  can: boolean;
  expression: string;
  role: RxRole;
}
