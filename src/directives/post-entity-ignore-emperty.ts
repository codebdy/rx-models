import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';

export class PostIgnorEntityEmpertyDirective extends PostDirective {
  static description = `如果为空，则忽略该字段`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_ENTITY_DIRECTIVE;

  static directiveName = 'ignoreEmperty';

  private oldRelationIds: number[] = [];

  async beforeSaveInstance(instanceMeta: InstanceMeta) {
    if (Array.isArray(this.directiveMeta?.value)) {
      for (const param of this.directiveMeta?.value) {
        await this.processOneField(instanceMeta, param);
      }
    } else {
      await this.processOneField(instanceMeta, this.directiveMeta?.value);
    }
    return instanceMeta;
  }

  private async processOneField(instanceMeta: InstanceMeta, param: any) {
    const fieldValue = instanceMeta.meta[param];
    if (!fieldValue) {
      delete instanceMeta.meta[param];
    }
  }
}
