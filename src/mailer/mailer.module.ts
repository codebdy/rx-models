import { Module } from '@nestjs/common';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailerController } from './mailer.controller';
import { MailerGateway } from './mailer.gateway';
import { MailerReceiveTasksPool } from './mailer.receive-tasks-pool';
import { SendService } from './mailer.send-service';

@Module({
  providers: [
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
    SendService,
  ],
  exports: [
    MailerGateway,
    MailerClientsPool,
    MailerReceiveTasksPool,
    SendService,
  ],
  controllers: [MailerController],
})
export class MailerModule {}
