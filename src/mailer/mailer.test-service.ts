import { Injectable } from '@nestjs/common';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { SmtpConfig } from 'src/entity-interface/SmtpConfig';
import { DEFAULT_TIME_OUT } from 'src/util/consts';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from './consts';
import { POP3Client } from './receive/poplib';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

export interface TestResult {
  status: boolean;
  message?: string;
}

@Injectable()
export class MailerTestService {
  testPOP3(config: MailReceiveConfig): Promise<TestResult> {
    return new Promise<TestResult>((resolve) => {
      let connecting = true;
      setTimeout(() => {
        if (connecting) {
          console.debug('Connect time out');
          resolve({ status: false, message: 'Connect time out' });
        }
      }, (config.timeout || DEFAULT_TIME_OUT) * 1000);

      const client = new POP3Client(config.port, config.host, {
        tlserrs: false,
        enabletls: config.ssl,
        debug: false,
      });

      client.on('connect', (data) => {
        connecting = false;
        console.debug('connect:', data);
        client.login(config.account, decypt(config.password, CRYPTO_KEY));
      });

      client.on('login', (status, rawdata) => {
        connecting = false;
        resolve({ status: status, message: rawdata });
      });

      client.on('error', (err) => {
        connecting = false;
        console.debug(err.toString() + ' errno:' + err.errno);
        resolve({ status: false, message: err.toString() });
      });
    });
  }

  testSMTP(config: SmtpConfig): Promise<TestResult> {
    return new Promise<TestResult>((resolve) => {
      const option = {
        host: config.host,
        port: config.port,
        secure: config.useSSL, // true for 465, false for other ports
        //service: 'Hotmail',
        //secureConnection: false, // use SSL
        requiresAuth: config.requiresAuth,
        ignoreTLS: !config.requireTLS || false,
        requireTLS: config.requireTLS || false,
        connectionTimeout: config.timeout * 1000, //单位是毫秒
        auth: {
          user: config.account,
          pass: decypt(config.password, CRYPTO_KEY),
        },
      };

      const transporter = nodemailer.createTransport(option);

      transporter.verify(function (error) {
        if (error) {
          console.debug(error);
          resolve({ status: false, message: error.toString() });
        } else {
          resolve({ status: true });
        }
      });
    });
  }
}
