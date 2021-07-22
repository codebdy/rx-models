import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { SALT_OR_ROUNDS } from 'src/util/consts';
import * as bcrypt from 'bcrypt';

export class PostEntityBcryptDirective extends PostDirective {
  static description = `加密一个或几个字段`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_ENTITY_DIRECTIVE;

  static directiveName = 'bcrypt';

  private oldRelationIds: number[] = [];

  async beforeSaveInstance(instanceMeta: InstanceMeta) {
    if (Array.isArray(this.directiveMeta?.value)) {
      for (const param of this.directiveMeta?.value) {
        await this.bcryptOneField(instanceMeta, param);
      }
    } else {
      await this.bcryptOneField(instanceMeta, this.directiveMeta?.value);
    }
    return instanceMeta;
  }

  private async bcryptOneField(instanceMeta: InstanceMeta, param: any) {
    const fieldValue = instanceMeta.meta[param];
    if (fieldValue) {
      instanceMeta.meta[param] = await bcrypt.hash(fieldValue, SALT_OR_ROUNDS);
    }
  }
}
