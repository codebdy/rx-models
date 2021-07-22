import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMeta } from './instance.meta';

export class RelationMetaCollection {
  entities: InstanceMeta[] = [];
  ids: number[] = [];
  commands: PostDirective[] = [];
  entity: string;
  relationName: string;
  isSingle = false;
}
