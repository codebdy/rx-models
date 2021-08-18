import { RxRole } from './RxRole';


export const EntityRxAbility = 'RxAbility';

export interface RxAbility {
  id?: number;
  entityUuid: string;
  columnUuid?: string;
  can: boolean;
  expression?: string;
  abilityType: string;
  role?: RxRole;
}
