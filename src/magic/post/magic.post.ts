import { AbilityService } from 'src/magic/ability.service';
import { PostDirectiveService } from 'src/directive/post-directive.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { InstanceMetaCollection } from 'src/magic-meta/post/instance.meta.colletion';
import { RelationMetaCollection } from 'src/magic-meta/post/relation.meta.colletion';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { InstanceMeta } from '../../magic-meta/post/instance.meta';
import { MagicPostParser } from './magic.post.parser';
import { AbilityType } from 'src/entity-interface/AbilityType';
import { MailerSendService } from 'src/mailer/send/mailer.send.service';
import { RxEventGateway } from 'src/rx-event/rx-event.gateway';
import { RxEventType } from 'src/rx-event/rx-event';

export class MagicPost {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly abilityService: AbilityService,
    private readonly postDirectiveService: PostDirectiveService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
    protected readonly mailerSendService: MailerSendService,
    protected readonly rxEventGateway: RxEventGateway,
  ) {}

  async post(json: any) {
    const savedInstances = {};
    const instances = await new MagicPostParser(
      this.entityManager,
      this.postDirectiveService,
      this.schemaService,
      this.magicService,
      this.abilityService,
      this.mailerSendService,
    ).parse(json);

    if (instances.length === 0) {
      throw new Error('No data is given for save!');
    }

    if (this.magicService.me.isDemo) {
      throw new Error('Demo account can not change data');
    }
    for (const instanceGroup of instances) {
      const data = await this.saveInstanceGroup(
        instanceGroup,
        this.entityManager,
      );
      savedInstances[instanceGroup.entity] = data;

      //异步函数
      await this.emitEvent(
        instanceGroup.entity,
        instanceGroup.isSingle ? [data] : data,
      );
    }
    return savedInstances;
  }

  private async emitEvent(entity: string, instances: any[]) {
    const entityMeta = this.schemaService.getEntityMetaOrFailed(entity);
    if (entityMeta.eventable) {
      for (const instance of instances) {
        let ownerId = instance.owner?.id;
        if (!ownerId) {
          const instanceWithOwner = await this.magicService.query({
            entity: entity,
            id: instance.id,
            '@getOne': true,
            owner: {},
          });
          ownerId = instanceWithOwner.data?.owner?.id;
        }
        this.rxEventGateway.broadcastEvent({
          eventType: RxEventType.InstancePost,
          fields: Object.keys(instance),
          entity: entity,
          ownerId: ownerId,
          ids: [instance.id],
        });
      }
    }
  }

  private async saveInstanceGroup(
    instanceGroup: InstanceMetaCollection,
    entityManger: EntityManager,
  ) {
    const savedInstances = [];

    for (const instanceMeta of instanceGroup.instances) {
      savedInstances.push(
        await this.saveInstance(instanceMeta, entityManger, instanceGroup),
      );
    }

    for (const directive of instanceGroup.directives) {
      await directive.afterSaveEntityInstanceCollection(
        savedInstances,
        instanceGroup,
      );
    }
    return instanceGroup.isSingle ? savedInstances[0] : savedInstances;
  }

  private async processRelationGroup(
    instanceMeta: InstanceMeta,
    relationCollection: RelationMetaCollection,
    entityManger: EntityManager,
  ) {
    for (const directive of relationCollection.directives) {
      await directive.beforeUpdateRelationCollection(
        instanceMeta,
        relationCollection,
      );
    }
    let savedInstances = [];

    for (const entity of relationCollection.entities) {
      savedInstances.push(
        await this.saveInstance(entity, entityManger, relationCollection),
      );
    }

    if (relationCollection.ids.length > 0) {
      const repository = entityManger.getRepository(relationCollection.entity);
      const relationEntities = await repository.findByIds(
        relationCollection.ids,
      );
      savedInstances = savedInstances.concat(relationEntities);
    }

    for (const directive of relationCollection.directives) {
      await directive.afterSaveOneRelationInstanceCollection(
        instanceMeta,
        savedInstances,
        relationCollection,
      );
    }
    return relationCollection.isSingle ? savedInstances[0] : savedInstances;
  }

  private async saveInstance(
    instanceMeta: InstanceMeta,
    entityManger: EntityManager,
    instanceGroup: InstanceMetaCollection | RelationMetaCollection,
  ) {
    if (
      JSON.stringify(instanceMeta.meta) === '{}' &&
      (!instanceMeta.relations ||
        JSON.stringify(instanceMeta.relations) === '{}')
    ) {
      throw new Error('Provided instance is emperty!');
    }
    //如果是新创建，需要检查create权限
    if (!instanceMeta.meta?.id && !this.magicService.me.isSupper) {
      this.validateCreate(instanceMeta);
    }
    if (instanceMeta.meta?.id && !this.magicService.me.isSupper) {
      await this.validateUpdate(instanceMeta);
    }

    let filterdInstanceMeta = instanceMeta;
    //保存前命令
    for (const directive of instanceGroup.directives) {
      filterdInstanceMeta = await directive.beforeSaveInstance(
        filterdInstanceMeta,
      );
    }
    const relations = filterdInstanceMeta.relations;

    for (const relationKey in relations) {
      const relationShip: RelationMetaCollection = relations[relationKey];
      const relationInstances = await this.processRelationGroup(
        filterdInstanceMeta,
        relationShip,
        entityManger,
      );
      filterdInstanceMeta.savedRelations[relationKey] =
        relationInstances.length === 0 ? null : relationInstances;
    }
    const repository = entityManger.getRepository(filterdInstanceMeta.entity);
    let entity: any = repository.create();
    if (filterdInstanceMeta.meta?.id) {
      entity = await repository.findOne(filterdInstanceMeta.meta?.id);
    }

    for (const attrKey in filterdInstanceMeta.meta) {
      if (attrKey !== 'id') {
        entity[attrKey] = filterdInstanceMeta.meta[attrKey];
      }
    }

    for (const relationKey in filterdInstanceMeta.savedRelations) {
      const relationValue = filterdInstanceMeta.savedRelations[relationKey];
      entity[relationKey] = relationValue;
    }

    const inststance = await repository.save(entity);

    //保存后命令
    for (const directive of instanceGroup.directives) {
      await directive.afterSaveInstance(inststance, filterdInstanceMeta.entity);
    }

    //过滤数据，只返回提供的字段
    const filteredInstance = {} as any;
    filteredInstance['id'] = inststance['id'];
    for (const key in instanceMeta.meta) {
      filteredInstance[key] = inststance[key];
    }
    for (const key in instanceMeta.relations) {
      filteredInstance[key] = inststance[key];
    }
    return filteredInstance;
  }

  private async validateUpdate(instanceMeta: InstanceMeta) {
    const entityAbility = instanceMeta.abilities.find(
      (ability) => ability.columnUuid === null,
    );

    if (!entityAbility?.can) {
      throw new Error(
        `${this.magicService.me.name} has not ability to update ${instanceMeta.entity}`,
      );
    }

    //如果没有展开
    if (!instanceMeta.expandFieldForAuth) {
      return;
    }

    const relatedAbilites = [entityAbility];
    for (const column of instanceMeta.entityMeta.columns) {
      if (instanceMeta.meta[column.name] !== undefined && column.name != 'id') {
        const ability = instanceMeta.abilities.find(
          (ability) => ability.columnUuid === column.uuid,
        );

        if (ability) {
          relatedAbilites.push(ability);
        } else {
          throw new Error(
            `${this.magicService.me.name} has not ability to update ${instanceMeta.entity} column ${column.name}`,
          );
        }
      }
    }

    const whereSql = relatedAbilites
      .filter((ability) => ability.expression)
      .map((ability) => ability.expression)
      .join(' AND ');
    if (whereSql) {
      const queryResult = await this.magicService.query({
        entity: instanceMeta.entity,
        id: instanceMeta.meta.id,
        where: whereSql,
      });

      if (!queryResult.data?.length) {
        throw new Error(
          `${this.magicService.me.name} has not ability to update ${instanceMeta.entity} some columns or instance not exist`,
        );
      }
    }
  }

  private validateCreate(instanceMeta: InstanceMeta) {
    const createAbility = instanceMeta.abilities.find(
      (ability) => ability.abilityType === AbilityType.CREATE,
    );

    if (!createAbility?.can) {
      throw new Error(
        `${this.magicService.me.name} has not ability to create ${instanceMeta.entity} instance `,
      );
    }
  }
}
