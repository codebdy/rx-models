import { Module } from '@nestjs/common';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailerController } from './mailer.controller';
import { MailerGateway } from './mailer.gateway';
import { MailerReceiveTasksPool } from './mailer.receive-tasks-pool';
import { MailerSendService } from './mailer.send-service';

@Module({
  providers: [
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
    MailerSendService,
  ],
  exports: [
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
    MailerSendService,
  ],
  controllers: [MailerController],
})
export class MailerModule {}
