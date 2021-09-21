import {
  EntityMailIdentifier,
  MailIdentifier,
} from 'src/entity-interface/MailIdentifier';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { BUCKET_MAILS } from 'src/util/consts';
import { MailerEvent, MailerEventType } from '../mailer.event';
import { JobOwner } from './job-owner';
import { MailTeller } from './mail-teller';

export interface IJob {
  jobOwner: JobOwner;

  start(): void;
  abort(): void;
  retry(): void;
}

export abstract class Job implements IJob {
  jobOwner: JobOwner;
  protected mailTeller = new MailTeller();
  protected mailAddress: string;
  protected isError = false;
  protected eventName = '';
  protected readonly typeOrmService: TypeOrmService;
  protected readonly storageService: StorageService;

  constructor(enventName: string) {
    this.eventName = enventName;
  }

  emit(event: MailerEvent): void {
    event.name = this.eventName;
    this.jobOwner.emit(event);
  }

  error(message: string) {
    this.emit({
      type: MailerEventType.error,
      message: message,
    });
    this.isError = true;
  }

  start(): void {
    this.emit({
      type: MailerEventType.checkStorage,
      message: 'Check storage',
    });

    this.storageService
      .checkAndCreateBucket(BUCKET_MAILS)
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

    const repository =
      this.typeOrmService.getRepository<MailIdentifier>(EntityMailIdentifier);
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

  retry(): void {
    this.start();
  }

  abstract receive(): void;
  abstract abort(): void;
}
