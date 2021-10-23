import { DirectiveType } from 'src/directive/directive-type';
import { PostDirective } from 'src/directive/post/post.directive';
import { EntityMail } from 'src/entity-interface/Mail';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';

export class PostEntitySendMailDirective extends PostDirective {
  static description = `发送邮件，格式sendMail(ids?:number[])`;

  static version = '1.0';

  static directiveType = DirectiveType.POST_ENTITY_DIRECTIVE;

  static directiveName = 'sendMail';

  async afterSaveEntityInstanceCollection(
    savedInstances: any[],
    instanceMetaCollection: InstanceMetaCollection,
  ) {
    let mailIds = Array.isArray(this.directiveMeta.value)
      ? this.directiveMeta.value
      : [this.directiveMeta.value];

    if (!this.directiveMeta.value) {
      if (instanceMetaCollection.entity !== EntityMail) {
        throw new Error(
          'Not privode mail id, and saved data is not a instance of Mail',
        );
      }
      mailIds = savedInstances?.map((instance) => instance.id);
    }

    await this.mailerSendService.sendMails(mailIds);
  }
}
