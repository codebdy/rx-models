import { Injectable } from '@nestjs/common';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { StorageService } from 'src/storage/storage.service';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailMessage } from './mailer.mail-message';
const MailComposer = require('nodemailer/lib/mail-composer');

@Injectable()
export class SendService {
  constructor(
    private readonly clientsPool: MailerClientsPool,
    protected readonly storageService: StorageService,
  ) {}

  async sendMessage(message: MailMessage) {
    //const mailFileName = await this.compileAndSaveMessage(message);
  }

  private async compileAndSaveMessage(uidl: string, message: MailMessage) {
    const mail = new MailComposer(message);
    return new Promise<string>((resolve, reject) => {
      console.log('Initial');

      mail.compile().build(function (err, message) {
        if (err) {
          reject(err);
        }
        this.storageService.saveMailToStorage(uidl, message, MailBoxType.SENT);
        //process.stdout.write(message);
        resolve('');
      });
    });
  }
}
