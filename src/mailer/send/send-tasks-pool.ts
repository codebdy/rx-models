import { Injectable } from '@nestjs/common';
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
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
  ) {}

  createTask(mail: Mail) {
    let task = this.pool.get(mail.id);
    if (!task) {
      task = new SendTask(
        this.typeOrmService,
        this.storageService,
        this.clientsPool,
        this,
        mail,
      );
      this.pool.set(mail.id, task);
      task.start();
    }
  }

  removeTask(mailId: number) {
    this.pool.delete(mailId);
  }

  getTask(mailId: number) {
    return this.pool.get(mailId);
  }
}
