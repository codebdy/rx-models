import { AddressItem } from 'src/entity-interface/AddressItem';
import { Mail } from 'src/entity-interface/Mail';
import { EntityMailConfig, MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { CRYPTO_KEY } from '../consts';
import { IJob } from '../job/i-job';
import { JobOwner } from '../job/job-owner';
import { MailMessage } from '../mailer.mail-message';
import { decypt } from 'src/util/cropt-js';
const nodemailer = require('nodemailer');

enum SendStatus {
  finished = 'finished',
  sending = 'sending',
  error = 'error',
}

type AddressItemWithStatus = AddressItem & {
  status?: SendStatus;
};
export class SendJob implements IJob {
  private aborted = false;
  constructor(
    public readonly jobOwner: JobOwner,
    protected readonly typeOrmService: TypeOrmService,
    protected readonly storageService: StorageService,
    protected readonly mailAddress: string,
    private readonly mail: Mail,
  ) {}

  start(): void {
    throw new Error('Method not implemented.');
  }
  abort(): void {
    this.aborted = true;
  }
  continue(): void {
    throw new Error('Method not implemented.');
  }

  private async sendMessage(message: MailMessage) {
    const mailConfig = await this.typeOrmService
      .getRepository<MailConfig>(EntityMailConfig)
      .findOne(message.fromConfigId);
    if (!mailConfig?.smtp) {
      throw Error('Can not find mail stmp config by id');
    }
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
        to: message.to, // list of receivers
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
      console.error(err);
    }
  }
}
