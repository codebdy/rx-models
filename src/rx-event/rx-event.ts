export enum RxEventType {
  InstancePost = 'InstancePost',
  InstanceUpdated = 'InstanceUpdated',
  InstanceDeleted = 'InstanceDeleted',
}
export interface RxEvent {
  eventType: RxEventType;
  entity: string;
  fields?: string[];
  ownerId?: number;
  ids?: number[];
}
