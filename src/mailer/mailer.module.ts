import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerGateway } from './mailer.gateway';
import { MailerReceiveService } from './mailer.receive-service';

@Module({
  providers: [MailerReceiveService, MailerGateway],
  exports: [MailerReceiveService, MailerGateway],
  controllers: [MailerController],
})
export class MailerModule {}
