import { Injectable } from '@nestjs/common';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { DEFAULT_TIME_OUT } from 'src/util/consts';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from './consts';
import { POP3Client } from './receive/poplib';

export interface TestResult {
  status: boolean;
  message?: string;
}

@Injectable()
export class MailerTestService {
  testPOP3(config: MailReceiveConfig): Promise<TestResult> {
    return new Promise<TestResult>((resolve) => {
      setTimeout(() => {
        console.debug('Connect time out');
        resolve({ status: false, message: 'Connect time out' });
      }, (config.timeout || DEFAULT_TIME_OUT) * 1000);

      const client = new POP3Client(config.port, config.host, {
        tlserrs: false,
        enabletls: config.ssl,
        debug: false,
      });

      client.on('connect', (data) => {
        console.debug('connect:', data);
        client.login(config.account, decypt(config.password, CRYPTO_KEY));
      });

      client.on('login', (status, rawdata) => {
        resolve({ status: status, message: rawdata });
      });

      client.on('error', (err) => {
        console.debug(err.toString() + ' errno:' + err.errno);
        resolve({ status: false, message: err.toString() });
      });
    });
  }
}
