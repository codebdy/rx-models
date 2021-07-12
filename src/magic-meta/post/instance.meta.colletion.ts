import { PostCommand } from 'src/command/post/post.command';
import { InstanceMeta } from './instance.meta';

export class InstanceMetaCollection {
  instances: InstanceMeta[] = [];
  commands: PostCommand[] = [];
  entity: string;
  isSingle = false;
}
