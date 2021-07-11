import { CommandMeta } from 'src/command/command.meta';
import { InstanceMeta } from './instance.meta';

export class RelationMetaCollection {
  entities: InstanceMeta[] = [];
  ids: number[] = [];
  commands: CommandMeta[] = [];
  entity: string;
  isSingleEntity = false;
}
