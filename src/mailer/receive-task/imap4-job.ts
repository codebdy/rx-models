/* eslint-disable @typescript-eslint/no-var-requires */
import { Imap4Folder } from 'src/entity-interface/Imap4Folder';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { decypt } from 'src/util/cropt-js';
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
    console.debug(`开始用IMAP4接收邮件:${mailAddress}`);
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
      console.debug(`邮件未解析完:${this.mailAddress}-${mailBox}`);
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
      //debug: console.error,
    });

    this.client.connect();
    this.emit({
      type: MailerEventType.connect,
      message: 'Connect to server...',
    });
    console.debug('准备接收邮件', this.mailAddress, this.mailBoxes);
    this.client.once('ready', () => {
      this.receiveOneBox();
    });

    this.client.once('error', (err) => {
      console.debug('Imap Error', err);
      this.error('Imap error:' + err);
      this.client?.end();
    });

    this.client.once('close', () => {
      console.debug('Connection closed');
      //this.jobOwner.finishJob();
    });

    this.client.once('end', () => {
      console.debug('Connection ended');
      this.client.destroy();
      this.client = undefined;
      this.jobOwner.finishJob();
    });
  }

  receiveOneBox() {
    try {
      if (this.mailBoxes.length === 0 || !this.client) {
        this.client?.end();
        return;
      }
      const imap4Folder = this.mailBoxes.pop();

      const mailSourceBox = getMailSrouceBox(imap4Folder as any);
      const mailTargetBox = getMailTargetBox(imap4Folder as any);
      console.debug(`准备接收邮件箱${this.mailAddress}-${mailSourceBox}`);

      if (!mailSourceBox) {
        this.receiveOneBox();
        return;
      }
      this.eventName = `${this.mailAddress}(IMAP4)-${mailSourceBox}`;
      this.emit({
        type: MailerEventType.openMailBox,
        message: 'Open mail box ...',
      });

      this.client.openBox(mailSourceBox, true, (error /*, box*/) => {
        if (error) {
          const errMsg = `Open mail box(${mailSourceBox}) error:` + error;
          console.debug(errMsg);
          this.error(errMsg);
          this.client?.end();
        }

        this.emit({
          type: MailerEventType.list,
          message: 'Get mail list ...',
        });
        this.client.search(['ALL'], (err, results) => {
          if (err) {
            const errMsg = `List mail box(${mailSourceBox}) error:` + err;
            console.debug(errMsg);
            this.error(errMsg);
            this.client?.end();
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
            console.debug(
              '没有新邮件:' + this.mailAddress + '-' + mailSourceBox,
            );
            this.receiveOneBox();
            return;
          }
          this.receiveOnChunk(mailTargetBox, 0);
        });
      });
    } catch (error) {
      console.error('捉到一个未知异常:', error);
      this.error('未知异常' + error);
    }
  }

  private receiveOnChunk(mailTargetBox: MailBoxType, chunkIndex: number) {
    const mailsToReceive = this.mailTeller.newMailList.splice(chunkIndex, 10);
    if (!mailsToReceive || mailsToReceive.length === 0) {
      this.receiveOneBox();
      return;
    }

    const f = this.client.fetch(mailsToReceive, {
      bodies: [''],
    });
    f.on('message', (msg /*, seqno*/) => {
      let uid = '';
      let parsedMail;
      let mailData;
      this.mailTeller.currentMailIndex++;

      msg.on('body', (stream, info) => {
        this.emit({
          type: MailerEventType.progress,
          message: `Recieving ${this.mailTeller.currentMailIndex} of ${this.mailTeller.totalNew}`,
          total: this.mailTeller.totalNew,
          current: this.mailTeller.currentMailIndex,
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
          const errMsg = 'Stream error:' + error;
          console.debug(errMsg);
          this.error(errMsg);
          this.client?.end();
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
      const errMsg = 'Fetch error:' + err;
      console.debug(errMsg);
      this.error(errMsg);
      this.client?.destroy();
      this.client = undefined;
    });
    f.once('end', () => {
      this.receiveOnChunk(mailTargetBox, chunkIndex);
    });
  }

  abort() {
    try {
      this.isAborted = true;
      this.client?.end();
    } catch (error) {
      const errorMsg = 'Abort error:' + error;
      console.error(errorMsg);
      this.error(errorMsg);
    }
  }
}
