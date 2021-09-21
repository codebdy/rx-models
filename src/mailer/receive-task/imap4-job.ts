import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { BUCKET_MAILS } from 'src/util/consts';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { MailerEventType } from '../mailer.event';
import { Job } from './job';
import { JobOwner } from './job-owner';

const Imap = require('imap'),
  inspect = require('util').inspect;

export class Imap4Job extends Job {
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
    const imap = new Imap({
      user: this.imap4Config.account,
      password: decypt(this.imap4Config.password, CRYPTO_KEY),
      host: this.imap4Config.host,
      port: this.imap4Config.port,
      tls: true,
    });

    imap.connect();
    imap.once('ready', () => {
      console.log('哈哈ready');
      //imap.close();
      imap.destroy();
    });

    imap.once('error', (err) => {
      console.log(err);
    });

    imap.once('close', () => {
      console.log('Connection closed');
      this.jobOwner.finishJob();
    });

    imap.once('end', () => {
      console.log('Connection ended');
      this.jobOwner.finishJob();
    });
  }
  abort() {}
  retry() {}
}
