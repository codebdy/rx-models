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
    private readonly accountId: number,
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
      console.log('哈哈ready');
      //imap.close();
      this.client.destroy();
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
