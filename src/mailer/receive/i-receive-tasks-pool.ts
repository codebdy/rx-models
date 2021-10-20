import { ReceiveTask } from './receive-task';

export interface IReceiveTasksPool {
  getTask(accountId: number): ReceiveTask;
  removeTask(accountId: number): void;
}
