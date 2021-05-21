import { Module } from '@nestjs/common';
import { MagicQueryController } from './magic.query.controller';
import { MagicQueryService } from './magic.query.service';

@Module({
  providers: [MagicQueryService],
  controllers: [MagicQueryController],
})
export class MagicModule {}
