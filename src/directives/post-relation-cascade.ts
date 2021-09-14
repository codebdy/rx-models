/* eslint-disable @typescript-eslint/no-unused-vars */
import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMeta } from 'src/magic-meta/post/instance.meta';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { EntityManager } from 'typeorm';

export class PostRelationCascadeDirective extends PostDirective {
  static description = `删除关联时，级联删除关联对象`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_RELATION_DIRECTIVE;

  static directiveName = 'cascade';

  private oldRelationIds: number[] = [];

  async beforeUpdateRelationCollection(
    ownerInstanceMeta: InstanceMeta,
    relationMetaCollection: RelationMetaCollection,
  ) {
    const data = await this.magicService.query({
      entity: ownerInstanceMeta.entity,
      id: ownerInstanceMeta.meta.id,
      [relationMetaCollection.relationName]: {},
      '@getOne': true,
    });
    if (data.data) {
      this.oldRelationIds = data.data[relationMetaCollection.relationName]?.map(
        (relation: { id: number }) => relation.id,
      );
    }
  }

  //该命令的权限通过magicService完成
  async afterSaveOneRelationInstanceCollection(
    ownerInstanceMeta: InstanceMeta,
    savedInstances: any[],
    relationMetaCollection: RelationMetaCollection,
  ) {
    const deleteIds = this.oldRelationIds.filter(
      (id) => !savedInstances.find((instance) => instance.id === id),
    );
    await this.magicService.delete({
      [relationMetaCollection.entity]: deleteIds,
    });
  }
}
