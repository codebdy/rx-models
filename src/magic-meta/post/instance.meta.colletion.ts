import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMeta } from './instance.meta';

export class InstanceMetaCollection {
  instances: InstanceMeta[] = [];
  commands: PostDirective[] = [];
  entity: string;
  isSingle = false;
}
