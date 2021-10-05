import { Injectable } from '@nestjs/common';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailMessage } from './mailer.mail-message';

@Injectable()
export class SendService {
  constructor(private readonly clientsPool: MailerClientsPool) {}

  async sendMessage(message: MailMessage) {
  }
}
