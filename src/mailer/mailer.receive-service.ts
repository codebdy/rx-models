import { Injectable, Logger } from '@nestjs/common';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { MailerGateway } from './mailer.gateway';
const POP3Client = require('poplib');

@Injectable()
export class MailerReceiveService {
  private readonly logger = new Logger('Mailer');
  constructor(private mailerGateWay: MailerGateway) {}

  receiveMails(configs: MailConfig[]) {
    const port = 995;
    const host = 'pop-mail.outlook.com';
    const client = new POP3Client(port, host, {
      tlserrs: false,
      enabletls: true,
      debug: true,
    });

    client.on('error', (err) => {
      if (err.errno === 111) console.log('Unable to connect to server');
      else console.log('Server error occurred');

      this.logger.error(err);
    });

    client.on('connect', () => {
      console.log('CONNECT success');
      client.login('username', 'password');
    });

    client.on('invalid-state', (cmd) => {
      console.log('Invalid state. You tried calling ' + cmd);
    });

    client.on('locked', (cmd) => {
      console.log(
        'Current command has not finished yet. You tried calling ' + cmd,
      );
    });

    client.on('login', (status, rawdata) => {
      if (status) {
        console.log('LOGIN/PASS success');
        client.list();
      } else {
        this.logger.error('LOGIN/PASS failed');
        console.log('LOGIN/PASS failed');
        client.quit();
      }
    });

    // Data is a 1-based index of messages, if there are any messages
    client.on('list', (status, msgcount, msgnumber, data, rawdata) => {
      if (status === false) {
        console.log('LIST failed');
        client.quit();
      } else {
        console.log('LIST success with ' + msgcount + ' element(s)');

        if (msgcount > 0) client.retr(1);
        else client.quit();
      }
    });

    client.on('retr', (status, msgnumber, data, rawdata) => {
      if (status === true) {
        console.log('RETR success for msgnumber ' + msgnumber);
        client.dele(msgnumber);
        client.quit();
      } else {
        console.log('RETR failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('dele', (status, msgnumber, data, rawdata) => {
      if (status === true) {
        console.log('DELE success for msgnumber ' + msgnumber);
        client.quit();
      } else {
        console.log('DELE failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('quit', (status, rawdata) => {
      if (status === true) console.log('QUIT success');
      else console.log('QUIT failed');
    });
  }
}
