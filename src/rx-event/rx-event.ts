export enum RxEventType {
  InstanceCreated = 'InstanceCreated',
  InstanceUpdated = 'InstanceUpdated',
  InstanceDeleted = 'InstanceDeleted',
}
export interface RxEvent {
  eventType: RxEventType;
  entity: string;
  fields?: string[];
  ownerId?: number;
}
