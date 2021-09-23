import { Injectable } from '@nestjs/common';
import { MailConfig } from 'entity-interface/MailConfig';
import { StorageService } from 'storage/storage.service';
import { TypeOrmService } from 'typeorm/typeorm.service';
import { MailerClientsPool } from './mailer.clients-pool';
import { ReceiveTask } from './receive-task/receive-task';

export interface TasksPool {
  getTask(accountId: number): ReceiveTask;
  removeTask(accountId: number): void;
}

@Injectable()
export class MailerReceiveTasksPool implements TasksPool {
  private pool = new Map<number, ReceiveTask>();

  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly storageService: StorageService,
    private readonly clientsPool: MailerClientsPool,
  ) {}

  createTask(accountId: number, configs: MailConfig[]) {
    let task = this.pool.get(accountId);
    if (!task) {
      task = new ReceiveTask(
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
