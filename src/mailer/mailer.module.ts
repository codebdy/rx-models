import { Module } from '@nestjs/common';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailerController } from './mailer.controller';
import { MailerGateway } from './mailer.gateway';
import { MailerReceiveService } from './mailer.receive-service';
import { MailerReceiveTasksPool } from './mailer.receive-tasks-pool';

@Module({
  providers: [
    MailerReceiveService,
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
  ],
  exports: [
    MailerReceiveService,
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
  ],
  controllers: [MailerController],
})
export class MailerModule {}
