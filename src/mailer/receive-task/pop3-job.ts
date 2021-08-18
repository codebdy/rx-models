import { Logger } from '@nestjs/common';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { MailerEvent, MailerEventType } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';
import _ from 'lodash';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { StorageService } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { FOLDER_MAILS } from 'src/util/consts';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const POP3Client = require('poplib');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const simpleParser = require('mailparser').simpleParser;

export class Pop3Job implements Job {
  private readonly logger = new Logger('Mailer');
  private isAborted = false;
  private client: any;
  private isError = false;
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly mailAddress: string,
    private readonly pop3Config: MailReceiveConfig,
    public readonly jobOwner: JobOwner,
  ) {}

  abort(): void {
    this.isAborted = true;
    this.client?.quit();
  }

  checkAbort() {
    if (this.isAborted) {
      this.jobOwner.finishJob();
    }
  }
  emit(event: MailerEvent): void {
    event.name = `${this.mailAddress}(POP3)`;
    this.jobOwner.emit(event);
  }

  error(message: string) {
    this.emit({
      type: MailerEventType.error,
      message,
    });
    this.isError = true;
  }

  readMailUidlList() {}

  async saveMailFile(data: any) {
    const fileName = uuidv4() + '.eml';
    return await this.storageService.putFileBuffer(FOLDER_MAILS, fileName, data);
  }

  start(): void {
    this.emit({
      type: MailerEventType.checkStorage,
      message: 'Check storage',
    });

    this.storageService
      .checkAndCreateFolder(FOLDER_MAILS)
      .then(() => {
        this.receive();
      })
      .catch((error) => {
        this.logger.error(error);
        this.error('Storage error:' + error);
      });
  }

  receive(): void {
    const config = this.pop3Config;
    this.emit({
      type: MailerEventType.connect,
      message: 'connecting to mail server ...',
    });

    const client = new POP3Client(config.port, config.host, {
      tlserrs: false,
      enabletls: true,
      debug: false,
    });
    this.client = client;

    client.on('error', (err) => {
      this.error(err.toString() + ' errno:' + err.errno);
      this.logger.error(err);
    });

    client.on('connect', (data) => {
      console.log('connect:', data);
      this.emit({
        type: MailerEventType.login,
        message: 'Logging ...',
      });
      client.login(config.account, decypt(config.password, CRYPTO_KEY));
    });

    client.on('invalid-state', (cmd) => {
      console.log('Invalid state. You tried calling ' + cmd);
    });

    client.on('locked', (cmd) => {
      console.debug(
        'Current command has not finished yet. You tried calling ' + cmd,
      );
    });

    client.on('login', (status /*, rawdata*/) => {
      if (status) {
        this.emit({
          type: MailerEventType.list,
          message: 'Listing ...',
        });
        client.list();
      } else {
        this.error('LOGIN/PASS failed');
        client.quit();
      }
    });

    // Data is a 1-based index of messages, if there are any messages
    client.on('list', (status, msgcount, msgnumber, data, rawdata) => {
      if (status === false) {
        this.error('LIST failed');
        client.quit();
      } else {
        console.log('哈哈', status, msgcount, msgnumber, rawdata);
        console.log('LIST success with ' + msgcount + ' element(s)');

        if (msgcount > 0) {
          this.emit({
            type: MailerEventType.uidl,
            message: 'Get uidl',
          });
          client.uidl();
        } else {
          client.quit();
          this.jobOwner.finishJob();
        }
      }
    });

    client.on('uidl', (status, msgnumber, data, rawdata) => {
      if (status === true) {
        //_.difference(array, [values])
        client.retr(1);
      } else {
        this.error('uidl failed');
        client.quit();
      }
    });

    client.on('retr', (status, msgnumber, data, rawdata) => {
      if (status === true) {
        //client.retr(msgnumber + 1);
        console.log('RETR success for msgnumber ' + msgnumber);
        this.saveMailFile(data)
          .then(() => {
            simpleParser(data)
              .then((parsed) => {
                console.log('哈哈2', parsed?.to?.value);
                console.log('哈哈3', parsed?.from?.value);
              })
              .catch((err) => {
                this.error('Parse mail error:' + err);
                console.error(err);
              });
          })
          .catch((error) => {
            console.error(error);
            this.error('Save mail file error:' + error);
          });

        //client.dele(msgnumber);
        //client.quit();
      } else {
        this.error('RETR failed for msgnumber ' + msgnumber);
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

    client.on('quit', (/*status, rawdata*/) => {
      if (!this.isError) {
        this.jobOwner.finishJob();
      }
    });
  }

  retry(): void {
    this.start();
  }
}
