import { RxRole } from './RxRole';
import { AbilityType } from './AbilityType';

export interface RxAbility {
  id?: number;
  entityUuid: string;
  columnUuid?: string;
  can: boolean;
  expression?: string;
  abilityType: AbilityType;
  role?: RxRole;
}
