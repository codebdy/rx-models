import { PostCommand } from 'src/command/post/post.command';
import { InstanceMeta } from './instance.meta';

export class RelationMetaCollection {
  entities: InstanceMeta[] = [];
  ids: number[] = [];
  commands: PostCommand[] = [];
  entity: string;
  relationName: string;
  isSingle = false;
}
