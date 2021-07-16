import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { AbilityController } from './ability.controller';
import { AbilityService } from './ability.service';

@Module({
  imports: [SchemaModule],
  providers: [AbilityService],
  exports: [AbilityService],
  controllers: [AbilityController],
})
export class AbilityModule {}
