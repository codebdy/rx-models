import { Module } from '@nestjs/common';
import { MagicQueryController } from './query/magic.query.controller';
import { MagicQueryService } from './query/magic.query.service';

@Module({
  providers: [MagicQueryService],
  controllers: [MagicQueryController],
})
export class MagicModule {}
