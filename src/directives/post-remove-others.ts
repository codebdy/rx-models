import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';

export class PostRemoveOthersDirective extends PostDirective {
  static description = `Remove records that not saved.此命令会删除POST之外的所有记录，请谨慎使用该命令`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_ENTITY_DIRECTIVE;

  static directiveName = 'removeOthers';

  //该命令权限管理通过MagicService实现
  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
  ) {
    const ids = savedInstances.map((instance) => instance.id);
    //目前万能接口不支持NOT IN运算符，变通实现一下
    const querMeta = {
      entity: instanceMetaCollection.entity,
      select: ['id'],
    };
    const data = await this.magicService.query(querMeta);
    const allIds = data.data?.map((instance: { id: number }) => instance.id);
    const deleteIds = allIds.filter(
      (id: number) => !ids.find((id2) => id === id2),
    );
    if (deleteIds.length > 0) {
      await this.magicService.delete({
        [instanceMetaCollection.entity]: deleteIds,
      });
    }
  }
}
