import { MailReceiveConfig } from 'src/entity-interface/MailReceiveConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { decypt } from 'src/util/cropt-js';
import { CRYPTO_KEY } from '../consts';
import { Job } from './job';
import { JobOwner } from './job-owner';

const Imap = require('imap'),
  inspect = require('util').inspect;

export class Imap4Job implements Job {
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly mailAddress: string,
    private readonly imap4Config: MailReceiveConfig,
    public readonly jobOwner: JobOwner,
    private readonly accountId: number,
  ) {}

  start() {
    const imap = new Imap({
      user: this.imap4Config.account,
      password: decypt(this.imap4Config.password, CRYPTO_KEY),
      host: this.imap4Config.host,
      port: this.imap4Config.port,
      tls: true,
    });

    imap.once('ready', () => {
      console.log('哈哈ready');
    });
  }
  abort() {}
  retry() {}
}
