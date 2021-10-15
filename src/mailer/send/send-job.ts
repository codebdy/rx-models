import { AddressItem } from 'src/entity-interface/AddressItem';
import { Mail } from 'src/entity-interface/Mail';
import { EntityMailConfig, MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { CRYPTO_KEY } from '../consts';
import { decypt } from 'src/util/cropt-js';
import { SendStatus } from 'src/entity-interface/SendStatus';
import { ISendJob } from './i-send-job';
import { MailOnQueue } from './mail-on-queue';
import { ISendJobOwner } from './i-send-job-owner';
import { MailerSendEventType } from './send-event';
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
    protected readonly typeOrmService: TypeOrmService,
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
    this.jobOwner.onQueueChange();
    this.jobOwner.emit({
      type: MailerSendEventType.sentOneMail,
      mailId: this.mail.id,
      mailSubject: this.mail.subject,
    });
    this.jobOwner.nextJob()?.start();
  }

  async start() {
    try {
      const mailConfig = await this.typeOrmService
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
      auth: {
        user: mailConfig.smtp.account,
        pass: decypt(mailConfig.smtp.password, CRYPTO_KEY),
      },
    };
    const transporter = nodemailer.createTransport(option);

    console.log('哈哈', option, message.to[0]);

    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"${mailConfig.sendName}" <${mailConfig.address}>`, // sender address
        to: message.to?.value, // list of receivers
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject, // Subject line
        text: message.text, // plain text body
        html: message.html, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      this.onError('Send error:' + err);
      console.error(err);
    }
  }
}
