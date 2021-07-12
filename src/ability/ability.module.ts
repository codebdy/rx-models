import { Module } from '@nestjs/common';
import { AbilityController } from './ability.controller';
import { AbilityService } from './ability.service';

@Module({
  providers: [AbilityService],
  exports: [AbilityService],
  controllers: [AbilityController],
})
export class AbilityModule {}
