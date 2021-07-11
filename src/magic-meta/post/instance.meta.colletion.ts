import { CommandMeta } from 'src/command/command.meta';
import { InstanceMeta } from './instance.meta';

export class InstanceMetaCollection {
  instances: InstanceMeta[] = [];
  commands: CommandMeta[] = [];
  entity: string;
  isSingle = false;
}
