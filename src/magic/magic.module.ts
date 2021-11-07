import { Global, Module } from '@nestjs/common';

import { DirectiveModule } from 'src/directive/directive.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { RxEventModule } from 'src/rx-event/rx-event.module';
import { SchemaModule } from 'src/schema/schema.module';
import { MagicController } from './magic.controller';
import { MagicUploadService } from './upload/magic.upload.service';

@Global()
@Module({
  imports: [SchemaModule, DirectiveModule, MailerModule, RxEventModule],
  providers: [MagicUploadService],
  controllers: [MagicController],
})
export class MagicModule {}
