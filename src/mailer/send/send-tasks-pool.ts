import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailerClientsPool } from '../mailer.clients-pool';
import { SendTask } from './send-task';
import { ISendTasksPool } from './i-send-tasks-pool';
import { Mail } from 'src/entity-interface/Mail';

@Injectable()
export class MailerSendTasksPool implements ISendTasksPool {
  private pool = new Map<number, SendTask>();

  constructor(
    @Inject(forwardRef(() => TypeOrmService))
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
  ) {}

  createTask(mail: Mail) {
    let task = this.pool.get(mail.owner.id);
    if (!task) {
      task = new SendTask(
        this.typeOrmService,
        this.storageService,
        this.clientsPool,
        this,
        mail.owner.id,
        [mail],
      );
      this.pool.set(mail.owner.id, task);
      task.start();
    } else {
      task.addMail(mail);
    }
  }

  removeTask(accountId: number) {
    this.pool.delete(accountId);
  }

  getTask(accountId: number) {
    return this.pool.get(accountId);
  }
}
