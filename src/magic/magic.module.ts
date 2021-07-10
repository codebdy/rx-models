import { Module } from '@nestjs/common';
import { MagicPostController } from './post/magic.post.controller';
import { MagicPostService } from './post/magic.post.service';
import { MagicQueryController } from './query/magic.query.controller';
import { MagicQueryService } from './query/magic.query.service';
import { MagicDeleteController } from './delete/magic.delete.controller';
import { MagicDeleteService } from './delete/magic.delete.service';
import { MagicUploadService } from './upload/magic.upload.service';
import { MagicUploadController } from './upload/magic.upload.controller';
import { MagicUpdateService } from './update/magic.update.service';
import { MagicUpdateController } from './update/magic.update.controller';
import { TypeOrmModule } from 'src/typeorm/typeorm.module';
import { CommandModule } from 'src/command/command.module';
import { MagicQueryParser } from './query/magic.query.parser';

@Module({
  imports: [TypeOrmModule, CommandModule],
  providers: [
    MagicQueryParser,
    MagicQueryService,
    MagicPostService,
    MagicDeleteService,
    MagicUploadService,
    MagicUpdateService,
  ],
  controllers: [
    MagicQueryController,
    MagicPostController,
    MagicDeleteController,
    MagicUploadController,
    MagicUpdateController,
  ],
})
export class MagicModule {}
