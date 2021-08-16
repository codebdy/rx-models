import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';

export class MailerReceiveTask {
  mailAddress: string;
  config: MailReceiveConfig;
  get key() {
    return this.mailAddress + '-' + this.config.name;
  }
}
