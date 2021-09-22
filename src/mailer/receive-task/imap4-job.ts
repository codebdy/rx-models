/* eslint-disable @typescript-eslint/no-var-requires */
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

export class Imap4Job extends Job {
  private isAborted = false;
  private client: any;
  private results: [] = [];

  constructor(
    protected readonly typeOrmService: TypeOrmService,
    protected readonly storageService: StorageService,
    protected readonly mailAddress: string,
    private readonly imap4Config: MailReceiveConfig,
    public readonly jobOwner: JobOwner,
    protected readonly accountId: number,
  ) {
    super(`${mailAddress}(IMAP4)`);
  }

  private async saveMail(
    buffer: any,
    parsedMail: any,
    uidl: string,
    mailBox: MailBoxType,
  ) {
    //console.log('哈哈 保存邮件');
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
      //console.log('呵呵呵 保存成功');
      //this.retrOne();
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
      /*this.client.getBoxes((error, boxes) => {
        console.log(`哈哈 ${this.mailAddress}:`, boxes);
        this.client.destroy();
      });*/
      this.client.openBox('Sent', true, (error /*, box*/) => {
        if (error) {
          throw error;
        }
        //console.log(`哈哈 ${this.mailAddress}:`, error, box);
        if (this.mailAddress !== '11011968@qq.com') {
          this.client.end();
          return;
        }
        this.client.search(['ALL'], (err, results) => {
          if (err) throw err;
          this.results = results;
          //console.log('哈哈 result', results);
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
                this.checkAndSaveMail(
                  mailData,
                  parsedMail,
                  uid,
                  MailBoxType.SENT,
                );
              });

              let buffer = Buffer.from([]);
              stream.on('data', (buf) => {
                buffer = Buffer.concat([buffer, buf]);
              });
              stream.on('end', () => {
                mailData = buffer;
                this.checkAndSaveMail(
                  mailData,
                  parsedMail,
                  uid,
                  MailBoxType.SENT,
                );
              });
              stream.on('error', (error) => {
                throw error;
              });
            });
            msg.once('attributes', (attrs) => {
              uid = attrs?.uid;
            });
            msg.once('end', () => {
              this.checkAndSaveMail(
                mailData,
                parsedMail,
                uid,
                MailBoxType.SENT,
              );
            });
          });
          f.once('error', (err) => {
            console.log('Fetch error: ' + err);
            throw err;
          });
          f.once('end', () => {
            this.client.end();
          });
        });
      });
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

  abort() {
    this.isAborted = true;
    this.client.destroy();
  }
}
