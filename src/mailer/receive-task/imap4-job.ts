import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { Job } from './job';
import { JobOwner } from './job-owner';

const Imap = require('imap'),
  inspect = require('util').inspect;

export class Imap4Job extends Job {
  private isAborted = false;
  private client: any;

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
      this.client.openBox('Sent', true, (error, box) => {
        console.log(`哈哈 ${this.mailAddress}:`, error, box);
        if (this.mailAddress !== '11011968@qq.com') {
          this.client.end();
          return;
        }
        this.client.search(['ALL'], (err, results) => {
          if (err) throw err;
          console.log('哈哈 result', results);
          if (!results || results.lenght === 0) {
            //没有结果时需要处理
          }
          const f = this.client.fetch(results, { bodies: '' });
          f.on('message', (msg, seqno) => {
            console.log('Message #%d', seqno);
            const prefix = '(#' + seqno + ') ';
            msg.on('body', (stream, info) => {
              console.log('哈哈body', info);
              var fs = require('fs'), fileStream;
              //stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.eml'));
            });
            msg.once('attributes', (attrs) => {
              console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', () => {
              console.log(prefix + 'Finished');
            });
          });
          f.once('error', (err) => {
            console.log('Fetch error: ' + err);
          });
          f.once('end', () => {
            console.log('Done fetching all messages!');
            this.client.end();
          });
        });
      });
    });

    this.client.once('error', (err) => {
      console.log(err);
    });

    this.client.once('close', () => {
      console.log('Connection closed');
      this.jobOwner.finishJob();
    });

    this.client.once('end', () => {
      console.log('Connection ended');
      this.jobOwner.finishJob();
    });
  }

  abort() {
    this.isAborted = true;
    this.client.destroy();
  }
}
