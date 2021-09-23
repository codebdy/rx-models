import { Module } from '@nestjs/common';

import { DirectiveModule } from 'directive/directive.module';
import { SchemaModule } from 'schema/schema.module';
import { MagicController } from './magic.controller';
import { MagicUploadService } from './upload/magic.upload.service';

@Module({
  imports: [SchemaModule, DirectiveModule],
  providers: [MagicUploadService],
  controllers: [MagicController],
})
export class MagicModule {}
