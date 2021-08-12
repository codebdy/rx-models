import { Injectable } from '@nestjs/common';
import { MailerGateway } from './mailer.gateway';

@Injectable()
export class MailerReceiveService {
  constructor(private mailerGateWay: MailerGateway) {}
  
  receiveMails(config: { accountId: number; emailAddress: string }) {

  }
}
