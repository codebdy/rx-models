import { Injectable } from '@nestjs/common';
import { EntityMail, Mail } from 'src/entity-interface/Mail';
import { StorageService } from 'src/storage/storage.service';
import { EntityManager } from 'typeorm';
import { MailerSendTasksPool } from './send-tasks-pool';

@Injectable()
export class MailerSendService {
  constructor(
    private readonly tasksPool: MailerSendTasksPool,
    protected readonly storageService: StorageService,
  ) {}

  //注意，这是一个异步函数
  async sendMails(ids: number[], entityManger: EntityManager) {
    if (!ids?.length) {
      return;
    }

    const mails = await entityManger
      .getRepository<Mail>(EntityMail)
      .createQueryBuilder('mail')
      .leftJoinAndSelect('mail.owner', 'owner')
      .leftJoinAndSelect('mail.attachments', 'attachments')
      .where('mail.id in (:...ids)', { ids: ids })
      .getMany();

    for (const mail of mails) {
      await this.tasksPool.createTask(mail, entityManger);
    }
  }
}
