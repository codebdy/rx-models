import { Logger } from '@nestjs/common';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { MailerEventType } from '../mailer.event';
import { ReceiveJob } from './receive-job';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { StorageService } from 'src/storage/storage.service';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { POP3Client } from './poplib';
import { JobOwner } from '../job/job-owner';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const simpleParser = require('mailparser').simpleParser;

export class Pop3Job extends ReceiveJob {
  private readonly logger = new Logger('Mailer');

  private client: any;

  constructor(
    protected readonly typeOrmService: TypeOrmService,
    protected readonly storageService: StorageService,
    protected readonly mailAddress: string,
    private readonly pop3Config: MailReceiveConfig,
    public readonly jobOwner: JobOwner,
    protected readonly accountId: number,
  ) {
    super(`${mailAddress}(POP3)`);
  }

  private async saveMail(
    uidl: string,
    data: any,
    mailBox: MailBoxType,
    size: number,
  ) {
    await this.saveMailToStorage(uidl, data, mailBox);
    const parsed = await simpleParser(data);
    try {
      await this.saveMailToDatabase(uidl, parsed, mailBox, size);
    } catch (error) {
      this.error('Save mail error:' + error, parsed.subject);
    }
  }

  abort(): void {
    this.isAborted = true;
    this.client?.quit();
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
    client.on('list', (status, msgcount, msgnumber, data /*, rawdata*/) => {
      if (status === false) {
        this.error('LIST failed');
        client.quit();
      } else {
        console.log('LIST success with ' + msgcount + ' element(s)');
        this.mailTeller.sizeList = data;
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

    const retrOne = () => {
      const msg = this.mailTeller.nextMsgNumber();
      const size = this.mailTeller.sizeList[msg];
      if (msg) {
        this.emit({
          type: MailerEventType.progress,
          message: `Recieving ${this.mailTeller.cunrrentNumber()} of ${
            this.mailTeller.totalNew
          }`,
          total: this.mailTeller.totalNew,
          current: this.mailTeller.cunrrentNumber(),
          size: size,
        });
        client.retr(msg);
      } else {
        client.quit();
      }
    };

    client.on('uidl', (status, msgnumber, data /*, rawdata*/) => {
      if (status === true) {
        //this.mailTeller.uidlData = data;
        this.mailTeller.tellIt(data);
        retrOne();
      } else {
        this.error('uidl failed');
        client.quit();
      }
    });

    client.on('retr', (status, msgnumber, data /*, rawdata*/) => {
      let size = 0;
      try {
        size = parseInt(this.mailTeller.sizeList[msgnumber]?.toString());
      } catch (e) {
        console.error('邮件大小转换出错', e);
      }
      if (status === true) {
        this.saveMail(
          this.mailTeller.getUidl(msgnumber),
          data,
          MailBoxType.INBOX,
          size,
        )
          .then(() => {
            retrOne();
          })
          .catch((error) => {
            console.error(error);
            this.error('Save mail error:' + error);
          });
      } else {
        this.error('RETR failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('dele', (status, msgnumber /*, data, rawdata*/) => {
      if (status === true) {
        console.debug('DELE success for msgnumber ' + msgnumber);
        client.quit();
      } else {
        console.debug('DELE failed for msgnumber ' + msgnumber);
        client.quit();
      }
    });

    client.on('quit', (/*status, rawdata*/) => {
      if (!this.isError) {
        this.jobOwner.finishJob();
      }
    });
  }
}
