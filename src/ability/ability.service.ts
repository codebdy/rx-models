import { Inject, Injectable, Scope } from '@nestjs/common';
import { RxAbility } from 'src/entity-interface/rx-ability';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TypeOrmService } from 'src/typeorm/typeorm.service';

@Injectable({ scope: Scope.REQUEST })
export class AbilityService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly typeormSerivce: TypeOrmService,
  ) {}

  getEntityReadAbility(): RxAbility | undefined {
    return undefined;
  }
}
