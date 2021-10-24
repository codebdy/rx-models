import { AddressItem } from 'src/entity-interface/AddressItem';
import { EntityMail, Mail } from 'src/entity-interface/Mail';
import { EntityMailConfig, MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { CRYPTO_KEY, RX_MAIL_SIGN_ID, RX_MAIL_TO_ID } from '../consts';
import { decypt } from 'src/util/cropt-js';
import { SendStatus } from 'src/entity-interface/SendStatus';
import { ISendJob } from './i-send-job';
import { MailOnQueue } from './mail-on-queue';
import { ISendJobOwner } from './i-send-job-owner';
import { MailerSendEventType } from './send-event';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { EntityManager } from 'typeorm';
import _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

type AddressItemWithStatus = AddressItem & {
  status?: SendStatus;
};
export class SendJob implements ISendJob {
  public error?: string;
  private aborted = false;
  private status = SendStatus.WAITING;
  private canCancel = false;
  constructor(
    private readonly entityManger: EntityManager,
    protected readonly storageService: StorageService,
    public readonly jobOwner: ISendJobOwner,
    private readonly mail: Mail,
  ) {
    if (mail.isSeparateSend) {
      this.canCancel = true;
    }
  }

  toQueueItem(): MailOnQueue {
    return {
      mailId: this.mail.id,
      mailSubject: this.mail.subject,
      details: this.error,
      status: this.status,
      canCancel: this.canCancel,
    };
  }

  onError(errorMsg: string) {
    this.error = errorMsg;
    this.status = SendStatus.ERROR;
    this.jobOwner.onErrorJob(this);
    this.jobOwner.nextJob()?.start();
    this.jobOwner.onQueueChange();
  }

  onFiished() {
    this.status = SendStatus.SUCCESS;
    this.jobOwner.emit({
      type: MailerSendEventType.sentOneMail,
      mailId: this.mail.id,
      mailSubject: this.mail.subject,
    });
    this.jobOwner.nextJob()?.start();
    this.jobOwner.onQueueChange();
  }

  async start() {
    try {
      this.status = SendStatus.SENDING;
      this.jobOwner.onQueueChange();
      const mailConfig = await this.entityManger
        .getRepository<MailConfig>(EntityMailConfig)
        .findOne(this.mail.fromConfigId);
      if (!mailConfig?.smtp) {
        throw Error('Can not find mail stmp config by id');
      }

      if (!this.mail.isSeparateSend) {
        await this.sendMessage(this.mail, mailConfig);
        this.onFiished();
      }
    } catch (error) {
      console.debug('Send error:', error);
      this.onError('Send error:' + error);
    }
  }

  abort(): void {
    this.aborted = true;
  }

  private async sendMessage(message: Mail, mailConfig: MailConfig) {
    //const mailFileName = await this.compileAndSaveMessage(message);
    const option = {
      host: mailConfig.smtp.host,
      port: mailConfig.smtp.port,
      secure: mailConfig.smtp.useSSL, // true for 465, false for other ports
      //service: 'Hotmail',
      //secureConnection: false, // use SSL
      requiresAuth: mailConfig.smtp.requiresAuth,
      ignoreTLS: !mailConfig.smtp.requireTLS || false,
      requireTLS: mailConfig.smtp.requireTLS || false,
      connectionTimeout: mailConfig.smtp.timeout * 1000, //单位是毫秒
      auth: {
        user: mailConfig.smtp.account,
        pass: decypt(mailConfig.smtp.password, CRYPTO_KEY),
      },
    };
    const transporter = nodemailer.createTransport(option);

    console.log('哈哈', option, message.to[0]);

    const attachments = [];
    for (const attachment of message.attachments || []) {
      const fileUrlOrPath = await this.storageService.fileLocalPath(
        attachment.path,
        attachment.bucket,
      );
      attachments.push({
        filename: attachment.fileName,
        path: fileUrlOrPath?.startsWith('http') ? undefined : fileUrlOrPath,
        href: fileUrlOrPath?.startsWith('http') ? fileUrlOrPath : undefined,
      });
    }
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${mailConfig.sendName}" <${mailConfig.address}>`, // sender address
      replyTo: `"${mailConfig.sendName}" <${
        mailConfig.smtp?.replyTo || mailConfig.address
      }>`,
      to: message.to, // list of receivers
      cc: message.cc,
      bcc: message.bcc,
      subject: message.subject, // Subject line
      text: message.text, // plain text body
      html: message.html
        ?.replace(RX_MAIL_SIGN_ID, 'rx-mailer-' + _.uniqueId())
        .replace(RX_MAIL_TO_ID, 'rx-mailer-' + _.uniqueId()), //删掉邮件编辑用的id
      attachments: attachments,
      inReplyTo: message.inReplyTo,
      references: message.references,
    });

    await this.entityManger.getRepository<Mail>(EntityMail).save({
      id: message.id,
      inMailBox: MailBoxType.LOCAL_OUTBOX,
      messageId: info.messageId,
    });

    this.jobOwner.emit({
      type: MailerSendEventType.sentOneMail,
      mailId: message.id,
      mailSubject: message.subject,
    });
  }
}
