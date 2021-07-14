import { Controller } from '@nestjs/common';
import { AbilityService } from './ability.service';

@Controller()
export class AbilityController {
  constructor(private readonly schemaService: AbilityService) {}
}
