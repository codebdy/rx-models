import { Module } from '@nestjs/common';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailerController } from './mailer.controller';
import { MailerGateway } from './mailer.gateway';
import { MailerReceiveTasksPool } from './mailer.receive-tasks-pool';

@Module({
  providers: [MailerGateway, MailerClientsPool, MailerReceiveTasksPool],
  exports: [MailerGateway, MailerClientsPool, MailerReceiveTasksPool],
  controllers: [MailerController],
})
export class MailerModule {}
