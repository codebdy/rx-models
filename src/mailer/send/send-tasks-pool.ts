import { Injectable } from '@nestjs/common';
import { MailConfig } from 'src/entity-interface/MailConfig';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { MailerClientsPool } from '../mailer.clients-pool';
import { SendTask } from './send-task';
import { ISendTasksPool } from './i-send-tasks-pool';

@Injectable()
export class MailerSendTasksPool implements ISendTasksPool {
  private pool = new Map<number, SendTask>();

  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
  ) {}

  createTask(accountId: number, configs: MailConfig[]) {
    let task = this.pool.get(accountId);
    if (!task) {
      task = new SendTask(
        this.typeOrmService,
        this.storageService,
        this.clientsPool,
        this,
        accountId,
        configs,
      );
      this.pool.set(accountId, task);
      task.start();
    } else {
      task.addConfigs(configs);
    }
  }

  removeTask(accountId: number) {
    this.pool.delete(accountId);
  }

  getTask(accountId: number) {
    return this.pool.get(accountId);
  }
}
