import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EntityMail, Mail } from 'src/entity-interface/Mail';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailerSendTasksPool } from './send-tasks-pool';

@Injectable()
export class MailerSendService {
  constructor(
    private readonly tasksPool: MailerSendTasksPool,
    protected readonly storageService: StorageService,
    @Inject(forwardRef(() => TypeOrmService))
    protected readonly typeOrmService: TypeOrmService,
  ) {}

  //注意，这是一个异步函数
  async sendMails(ids?: number[]) {
    if (!ids?.length) {
      return;
    }

    const mails = await this.typeOrmService
      .getRepository<Mail>(EntityMail)
      .createQueryBuilder('mail')
      .leftJoinAndSelect('user.owner', 'owner')
      .leftJoinAndSelect('user.draftAttachments', 'attachments')
      .where('mail.id in (:...ids)', { ids: ids })
      .getMany();

    for (const mail of mails) {
      await this.tasksPool.createTask(mail);
    }
  }
}
