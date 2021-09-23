import { Module } from '@nestjs/common';

import { DirectiveModule } from 'src/directive/directive.module';
import { SchemaModule } from 'src/schema/schema.module';
import { MagicController } from './magic.controller';
import { MagicUploadService } from './upload/magic.upload.service';

@Module({
  imports: [SchemaModule, DirectiveModule],
  providers: [MagicUploadService],
  controllers: [MagicController],
})
export class MagicModule {}
