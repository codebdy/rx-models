/* eslint-disable @typescript-eslint/no-var-requires */
import { Imap4Folder } from 'src/entity-interface/Imap4Folder';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
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
  private results: [] = [];
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

    this.client.connect();
    this.client.once('ready', () => {
      this.receiveOneBox();
    });

    this.client.once('error', (err) => {
      console.log(err);
      throw err;
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
    this.client.openBox(mailSourceBox, true, (error /*, box*/) => {
      if (error) {
        throw error;
      }
      if (this.mailAddress !== '11011968@qq.com') {
        this.client.end();
        return;
      }
      this.client.search(['ALL'], (err, results) => {
        if (err) throw err;
        this.results = results;
        this.mailTeller.tellIt(results);
        if (
          !this.mailTeller.newMailList ||
          this.mailTeller.newMailList.length === 0
        ) {
          this.client.end();
          return;
        }
        console.log('哈哈啊', results, this.mailTeller.newMailList);
        const f = this.client.fetch(this.mailTeller.newMailList, {
          bodies: [''],
        });
        f.on('message', (msg /*, seqno*/) => {
          let uid = '';
          let parsedMail;
          let mailData;
          msg.on('body', (stream /*, info*/) => {
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
              throw error;
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
          console.log('Fetch error: ' + err);
          throw err;
        });
        f.once('end', () => {
          this.receiveOneBox();
        });
      });
    });
  }

  retrOne(mailTargetBox: MailBoxType) {
    this.client.search(['ALL'], (err, results) => {
      if (err) throw err;
      this.results = results;
      if (!this.results || this.results.length === 0) {
        this.client.end();
      }
      const f = this.client.fetch(this.results, {
        bodies: [''],
      });
      f.on('message', (msg /*, seqno*/) => {
        let uid = '';
        let parsedMail;
        let mailData;
        msg.on('body', (stream /*, info*/) => {
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
            throw error;
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
        console.log('Fetch error: ' + err);
        throw err;
      });
      f.once('end', () => {
        this.receiveOneBox();
      });
    });
  }

  abort() {
    this.isAborted = true;
    this.client.destroy();
  }
}
