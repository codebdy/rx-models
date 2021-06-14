import { Module } from '@nestjs/common';
import { MagicPostController } from './post/magic.post.controller';
import { MagicPostService } from './post/magic.post.service';
import { MagicQueryController } from './query/magic.query.controller';
import { MagicQueryService } from './query/magic.query.service';
import { MagicDeleteController } from './delete/magic.delete.controller';
import { MagicDeleteService } from './delete/magic.delete.service';

@Module({
  providers: [
    MagicQueryService,
    MagicPostService,
    MagicDeleteService,
  ],
  controllers: [
    MagicQueryController,
    MagicPostController,
    MagicDeleteController,
  ],
})
export class MagicModule {}
