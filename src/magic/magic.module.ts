import { Module } from '@nestjs/common';

import { CommandModule } from 'src/directive/directive.module';
import { SchemaModule } from 'src/schema/schema.module';
import { MagicController } from './magic.controller';
import { MagicUploadService } from './upload/magic.upload.service';

@Module({
  imports: [SchemaModule, CommandModule],
  providers: [MagicUploadService],
  controllers: [MagicController],
})
export class MagicModule {}
