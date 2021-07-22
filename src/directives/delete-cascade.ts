import { DirectiveType } from 'src/directive/directive-type';
import { DeleteDirective } from 'src/directive/delete/delete.directive';
import { DeleteMeta } from 'src/magic-meta/delete/delete.meta';

export class DeleteCascadeDirective extends DeleteDirective {
  static description = `删除时，级联删除指定关联对象`;

  static version = '1.0';

  static directiveType = DirectiveType.DELETE_DIRECTIVE;

  static directiveName = 'cascade';

  async beforeDelete(deleteMeta: DeleteMeta) {
    return;
  }

  async afterDelete(deletedIds: number[], deleteMeta: DeleteMeta) {}
}
