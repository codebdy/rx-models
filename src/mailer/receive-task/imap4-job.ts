/* eslint-disable @typescript-eslint/no-var-requires */
import { Imap4Folder } from 'entity-interface/Imap4Folder';
import { MailBoxType } from 'entity-interface/MailBoxType';
import { MailReceiveConfig } from 'entity-interface/MailReceiveConfig';
import { StorageService } from 'storage/storage.service';
import { TypeOrmService } from 'typeorm/typeorm.service';
import { decypt } from 'util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { MailerEventType } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';

const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;

function getMailSrouceBox(imap4Folder: { value: string; label: string }) {
  if (imap4Folder.value === Imap4Folder.InBoxToInBox) {
    return MailBoxType.INBOX;
  }
  if (imap4Folder.value === Imap4Folder.SentBoxToSentBox) {
    return MailBoxType.SENT;
  }
  if (imap4Folder.value === Imap4Folder.SpamBoxToInBox) {
    return MailBoxType.JUNK;
  }
  if (imap4Folder.value === Imap4Folder.SpamBoxToSpamBox) {
    return MailBoxType.JUNK;
  }
}

function getMailTargetBox(imap4Folder: { value: string; label: string }) {
  if (imap4Folder.value === Imap4Folder.InBoxToInBox) {
    return MailBoxType.INBOX;
  }
  if (imap4Folder.value === Imap4Folder.SentBoxToSentBox) {
    return MailBoxType.SENT;
  }
  if (imap4Folder.value === Imap4Folder.SpamBoxToInBox) {
    return MailBoxType.INBOX;
  }
  if (imap4Folder.value === Imap4Folder.SpamBoxToSpamBox) {
    return MailBoxType.JUNK;
  }
}

export class Imap4Job extends Job {
  private client: any;
  private results: string[] = [];
  private mailBoxes: string[] = [];

  constructor(
    protected readonly typeOrmService: TypeOrmService,
    protected readonly storageService: StorageService,
    protected readonly mailAddress: string,
    private readonly imap4Config: MailReceiveConfig,
    public readonly jobOwner: JobOwner,
    protected readonly accountId: number,
  ) {
    super(`${mailAddress}(IMAP4)`);
    this.mailBoxes = imap4Config.folders || [];
    console.debug('启动 Imap4 Job', this.mailBoxes, mailAddress);
  }

  private async saveMail(
    buffer: any,
    parsedMail: any,
    uidl: string,
    mailBox: MailBoxType,
  ) {
    await this.saveMailToStorage(uidl, buffer, mailBox);
    await this.saveMailToDatabase(uidl, parsedMail, mailBox);
  }

  private checkAndSaveMail(
    buffer: any,
    parsedMail: any,
    uidl: string,
    mailBox: MailBoxType,
  ) {
    if (!buffer || !parsedMail || !uidl) {
      //还没有解析完，返回
      return;
    }
    this.saveMail(buffer, parsedMail, uidl, mailBox).then(() => {
      console.debug('save mail succeed!');
    });
  }

  receive() {
    this.client = new Imap({
      user: this.imap4Config.account,
      password: decypt(this.imap4Config.password, CRYPTO_KEY),
      host: this.imap4Config.host,
      port: this.imap4Config.port,
      tls: true,
    });

    console.log('哈哈we 1', this.mailBoxes);

    this.client.connect();
    this.emit({
      type: MailerEventType.connect,
      message: 'Connect to server...',
    });
    this.client.once('ready', () => {
      this.receiveOneBox();
    });

    this.client.once('error', (err) => {
      console.log(err);
      this.error('Receive error:' + err);
      this.client.end();
    });

    this.client.once('close', () => {
      console.debug('Connection closed');
      this.jobOwner.finishJob();
    });

    this.client.once('end', () => {
      console.debug('Connection ended');
      this.jobOwner.finishJob();
    });
  }

  receiveOneBox() {
    console.log('哈哈1', this.mailBoxes);
    if (this.mailBoxes.length === 0) {
      this.client.end();
      return;
    }
    const imap4Folder = this.mailBoxes.pop();
    const mailSourceBox = getMailSrouceBox(imap4Folder as any);
    const mailTargetBox = getMailTargetBox(imap4Folder as any);

    if (!mailSourceBox) {
      this.receiveOneBox();
      return;
    }
    this.eventName = `${this.mailAddress}(IMAP4)-${mailSourceBox}`;
    console.log('哈哈', this.eventName);
    this.emit({
      type: MailerEventType.openMailBox,
      message: 'Open mail box ...',
    });

    this.client.openBox(mailSourceBox, true, (error /*, box*/) => {
      if (error) {
        this.error(`Open mail box(${mailSourceBox}) error:` + error);
        this.client.end();
      }

      this.emit({
        type: MailerEventType.list,
        message: 'Get mail list ...',
      });
      this.client.search(['ALL'], (err, results) => {
        if (err) {
          this.error(`List mail box(${mailSourceBox}) error:` + err);
          this.client.end();
        }
        this.results = results;
        this.mailTeller.tellIt(
          this.results.map((uidl) => uidl.toString()),
          0,
        );
        if (
          !this.mailTeller.newMailList ||
          this.mailTeller.newMailList.length === 0
        ) {
          this.client.end();
          return;
        }
        const f = this.client.fetch(this.mailTeller.newMailList, {
          bodies: [''],
        });
        f.on('message', (msg, seqno) => {
          let uid = '';
          let parsedMail;
          let mailData;

          if (this.isAborted) {
            this.client.end();
            return;
          }

          msg.on('body', (stream, info) => {
            this.emit({
              type: MailerEventType.progress,
              message: `Recieving ${this.mailTeller.cunrrentNumber()} of ${
                this.mailTeller.totalNew
              }`,
              total: this.mailTeller.totalNew,
              current: seqno,
              size: info.size,
            });
            simpleParser(stream, (err, mail) => {
              parsedMail = mail;
              this.checkAndSaveMail(mailData, parsedMail, uid, mailTargetBox);
            });

            let buffer = Buffer.from([]);
            stream.on('data', (buf) => {
              buffer = Buffer.concat([buffer, buf]);
            });
            stream.on('end', () => {
              mailData = buffer;
              this.checkAndSaveMail(mailData, parsedMail, uid, mailTargetBox);
            });
            stream.on('error', (error) => {
              this.error('Stream error:' + error);
              this.client.end();
            });
          });
          msg.once('attributes', (attrs) => {
            uid = attrs?.uid;
          });
          msg.once('end', () => {
            this.checkAndSaveMail(mailData, parsedMail, uid, mailTargetBox);
          });
        });
        f.once('error', (err) => {
          this.error('Fetch error:' + err);
          this.client.end();
        });
        f.once('end', () => {
          this.receiveOneBox();
        });
      });
    });
  }

  abort() {
    this.isAborted = true;
    this.client?.end();
  }
}
