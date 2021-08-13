import { Injectable } from '@nestjs/common';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { MailerGateway } from './mailer.gateway';

@Injectable()
export class MailerReceiveService {
  constructor(private mailerGateWay: MailerGateway) {}
  
  receiveMails(configs: MailConfig[]) {

  }
}
