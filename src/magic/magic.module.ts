import { Module } from '@nestjs/common';
import { MagicPostController } from './post/magic.post.controller';
import { MagicPostService } from './post/magic.post.service';
import { MagicQueryController } from './query/magic.query.controller';
import { MagicQueryService } from './query/magic.query.service';

@Module({
  providers: [MagicQueryService, MagicPostService],
  controllers: [MagicQueryController, MagicPostController],
})
export class MagicModule {}
