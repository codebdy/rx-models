import { Logger } from '@nestjs/common';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { MailerEvent, MailerEventType } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { StorageService } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { FOLDER_MAILS } from 'src/util/consts';
import _ = require('lodash');
import { EntityMail, Mail } from 'src/entity-interface/Mail';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const POP3Client = require('poplib');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const simpleParser = require('mailparser').simpleParser;

export interface MailIdentifier {
  msg: number;
  uidl: string;
}

export class MailTeller {
  localMailList: string[] = [];
  newMailList: string[] = [];
  uidlData: any;
  sizeList: string[] = [];

  totalNew: number;

  /**
   * 识别新邮件
   */
  tellIt(): void {
    this.newMailList = _.difference(this.uidlData, this.localMailList).splice(
      1,
    );
    this.totalNew = this.newMailList.length;
  }

  getUidl(msg: string): string {
    return this.uidlData[msg];
  }

  getMsgNumber(uidl: string): string {
    for (const msg in this.uidlData) {
      if (this.uidlData[msg] === uidl) {
        return msg;
      }
    }
  }

  nextMsgNumber(): string {
    if (this.newMailList.length > 0) {
      const uidl = this.newMailList.shift();
      return this.getMsgNumber(uidl);
    }
  }

  cunrrentNumber(): number {
    return this.totalNew - this.newMailList.length;
  }
}

export class Pop3Job implements Job {
  private readonly logger = new Logger('Mailer');
  private mailTeller = new MailTeller();
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
      message: message,
    });
    this.isError = true;
  }

  async saveMail(uidl: string, data: any) {
    const fileName = uuidv4() + '.eml';
    await this.storageService.putFileData(FOLDER_MAILS, fileName, data);
    const parsed = await simpleParser(data);
    const repository = this.typeOrmService.getRepository<Mail>(EntityMail);

    await repository.insert({
      uidl: uidl,
      subject: parsed.subject,
      mailAddress: this.mailAddress,
    });
  }

  start(): void {
    this.emit({
      type: MailerEventType.checkStorage,
      message: 'Check storage',
    });

    this.storageService
      .checkAndCreateFolder(FOLDER_MAILS)
      .then(() => {
        this.readLocalMailList();
      })
      .catch((error) => {
        console.error(error);
        this.error('Storage error:' + error);
      });
  }

  readLocalMailList(): void {
    this.emit({
      type: MailerEventType.readLocalMailList,
      message: 'Read local mail list',
    });

    const repository = this.typeOrmService.getRepository<Mail>(EntityMail);
    repository
      .find({
        select: ['uidl'],
        where: { mailAddress: this.mailAddress },
      })
      .then((data) => {
        this.mailTeller.localMailList = data.map((mail) => mail.uidl);
        this.receive();
      })
      .catch((error) => {
        console.error(error);
        this.error('Read local mail list error:' + error);
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
      if (msg) {
        this.emit({
          type: MailerEventType.progress,
          message: `Recieving ${this.mailTeller.cunrrentNumber()} of ${
            this.mailTeller.totalNew
          }`,
          total: this.mailTeller.totalNew,
          current: this.mailTeller.cunrrentNumber(),
          size: this.mailTeller.sizeList[msg],
        });
        client.retr(msg);
      } else {
        client.quit();
      }
    };

    client.on('uidl', (status, msgnumber, data /*, rawdata*/) => {
      if (status === true) {
        this.mailTeller.uidlData = data;
        this.mailTeller.tellIt();
        retrOne();
      } else {
        this.error('uidl failed');
        client.quit();
      }
    });

    client.on('retr', (status, msgnumber, data /*, rawdata*/) => {
      if (status === true) {
        this.saveMail(this.mailTeller.getUidl(msgnumber), data)
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
