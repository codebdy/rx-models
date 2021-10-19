import { Attachment, EntityAttachment } from 'src/entity-interface/Attachment';
import {
  EmailAddress,
  EntityEmailAddress,
} from 'src/entity-interface/EmailAddress';
import { EntityMail, Mail } from 'src/entity-interface/Mail';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { EntityMailConfig, MailConfig } from 'src/entity-interface/MailConfig';
import {
  EntityMailIdentifier,
  MailIdentifier,
} from 'src/entity-interface/MailIdentifier';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { BUCKET_MAILS, FOLDER_ATTACHMENTS } from 'src/util/consts';
import { getExt } from 'src/util/get-ext';
import { IReceiveJobOwner } from './i-receive-job-owner';
import { MailTeller } from './mail-teller';
import { IReceiveJob } from './i-receive-job';
import { MailerReceiveEvent, MailerReceiveEventType } from './receive-event';

export abstract class ReceiveJob implements IReceiveJob {
  jobOwner: IReceiveJobOwner;
  protected mailTeller = new MailTeller();
  protected mailAddress: string;
  protected eventName = '';
  protected readonly typeOrmService: TypeOrmService;
  protected readonly storageService: StorageService;
  protected readonly accountId: number;
  protected isAborted = false;

  constructor(enventName: string) {
    this.eventName = enventName;
  }

  checkAbort() {
    if (this.isAborted) {
      this.jobOwner.finishJob();
    }
  }

  emit(event: MailerReceiveEvent): void {
    event.name = this.eventName;
    this.jobOwner.emit(event);
  }

  error(message: string, subject?: string) {
    this.emit({
      type: MailerReceiveEventType.error,
      message: message,
      subject: subject,
    });
  }

  start(): void {
    this.emit({
      type: MailerReceiveEventType.checkStorage,
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
      type: MailerReceiveEventType.readLocalMailList,
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

  async saveMailToStorage(uidl: string, data: any, mailBox: MailBoxType) {
    const fileName = this.getMailFileName(uidl, mailBox);
    await this.storageService.putFileData(fileName, data, BUCKET_MAILS);
  }

  async saveMailToDatabase(
    uidl: string,
    passedMail: any,
    mailBox: MailBoxType,
    size: number,
  ) {
    const attachments = [];
    if (!passedMail) {
      throw new Error('NO parsed mail is provided');
    }
    for (let i = 0; i < passedMail.attachments?.length; i++) {
      const attachementObj = passedMail.attachments[i];
      const path = `${
        this.mailAddress
      }/${FOLDER_ATTACHMENTS}/${uidl}-${i}.${getExt(attachementObj.filename)}`;
      if (attachementObj.related) {
        //可能不需要保存
        continue;
      }
      await this.storageService.putFileData(
        path,
        attachementObj.content,
        BUCKET_MAILS,
      );
      attachments.push(
        await this.typeOrmService
          .getRepository<Attachment>(EntityAttachment)
          .save({
            fileName: attachementObj.filename,
            mimeType: attachementObj.contentType,
            size: attachementObj.size,
            path: path,
          }),
      );
    }

    let fromOldCustomer = false;
    const fromAddress = passedMail.from?.value[0]?.address;
    fromOldCustomer = !!(await this.typeOrmService
      .getRepository<MailConfig>(EntityMailConfig)
      .findOne({ address: fromAddress }));

    if (!fromOldCustomer) {
      fromOldCustomer = !!(await this.typeOrmService
        .getRepository<EmailAddress>(EntityEmailAddress)
        .findOne({ address: fromAddress }));
    }

    const mail = await this.typeOrmService
      .getRepository<Mail>(EntityMail)
      .save({
        subject: passedMail.subject,
        from: passedMail.from?.value ? passedMail.from?.value[0] : undefined,
        to: passedMail.to?.value,
        cc: passedMail.cc?.value,
        bcc: passedMail.bcc?.value,
        date: passedMail.date,
        messageId: passedMail.messageId,
        inReplyTo: passedMail.inReplyTo,
        replyTo: passedMail.replyTo,
        references: passedMail.references,
        html: passedMail.html,
        text: passedMail.text,
        priority: passedMail.priority,
        owner: { id: this.accountId },
        inMailBox: mailBox,
        fromAddress: fromAddress,
        attachments: attachments,
        fromOldCustomer: fromOldCustomer,
        size: size,
      });
    await this.typeOrmService
      .getRepository<MailIdentifier>(EntityMailIdentifier)
      .save({
        uidl: uidl,
        mailAddress: this.mailAddress,
        file: this.getMailFileName(uidl, mailBox),
        mail: mail,
        fromBox: mailBox,
      });
  }

  continue(): void {
    this.start();
  }

  private getMailFileName(uidl: string, mailBox: MailBoxType) {
    return `${this.mailAddress}/${mailBox}/${uidl}.eml`;
  }
  abstract receive(): void;
  abstract abort(): void;
}
