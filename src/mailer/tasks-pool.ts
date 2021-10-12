import { ReceiveTask } from './receive/receive-task';


export interface TasksPool {
  getTask(accountId: number): ReceiveTask;
  removeTask(accountId: number): void;
}
