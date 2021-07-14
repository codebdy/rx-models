import { Injectable } from '@nestjs/common';
import { RxAbility } from 'src/entity-interface/rx-ability';

@Injectable()
export class AbilityService {
  getEntityReadAbility(): RxAbility | undefined {
    return undefined;
  }
}
