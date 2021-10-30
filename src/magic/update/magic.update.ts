import { Injectable } from '@nestjs/common';
import { MagicService } from 'src/magic-meta/magic.service';
import { UpdateMeta } from 'src/magic-meta/update/update.meta';
import { AbilityService } from 'src/magic/ability.service';
import { SchemaService } from 'src/schema/schema.service';
import { EntityManager } from 'typeorm';
import { MagicUpdateParser } from './magic.update.parser';

@Injectable()
export class MagicUpdate {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly schemaService: SchemaService,
    private readonly abilityService: AbilityService,
    private readonly magicService: MagicService,
  ) {}

  async update(json: any) {
    const metas = await new MagicUpdateParser(
      this.schemaService,
      this.abilityService,
    ).parse(json);
    const result = {} as any;
    for (const meta of metas) {
      let where = meta.whereSQL;
      if (meta.ids?.length) {
        const sql =
          meta.ids.length > 1
            ? ` id in(${meta.ids.join(',')})`
            : `id = ${meta.ids[0]}`;
        if (where) {
          where = where + ' and ' + sql;
        } else {
          where = sql;
        }
      }

      const queryData = await this.magicService.query({
        entity: meta.entity,
        select: ['id'],
        where: where,
      });

      meta.ids = queryData?.data?.map((one: { id: number }) => one.id);

      console.log('哈哈哈', queryData, meta.ids);

      if (!this.magicService.me.isSupper) {
        await this.validateUpdate(meta);
      }

      if (meta.ids.length > 0) {
        await this.entityManager
          .createQueryBuilder()
          .update(meta.entity)
          .set(meta.columns)
          .whereInIds(meta.ids)
          .execute();
        if (meta.ids.length <= 100) {
          result[meta.entity] = await this.magicService.query({
            entity: meta.entity,
            select: this.getUpdatColumnNames(meta),
            where:
              meta.ids.length > 1
                ? `id in(${meta.ids.join(',')})`
                : `id = ${meta.ids[0]}`,
          });
        } else {
          result['message'] = `${meta.ids.length} updated`;
        }
      }
    }
    return result;
  }

  private getUpdatColumnNames(updateMeta: UpdateMeta) {
    const columnNames = [];
    for (const columnName in updateMeta.columns) {
      columnNames.push(columnName);
    }
    return columnNames;
  }

  private async validateUpdate(updateMeta: UpdateMeta) {
    const entityAbility = updateMeta.abilities.find(
      (ability) => ability.columnUuid === null,
    );

    if (!entityAbility?.can) {
      throw new Error(
        `${this.magicService.me.name} has not ability to update ${updateMeta.entity}`,
      );
    }

    //如果没有展开
    if (!updateMeta.expandFieldForAuth) {
      return;
    }

    const relatedAbilites = [entityAbility];
    for (const columnName in updateMeta.columns) {
      if (columnName === 'id') {
        throw new Error(`Id column can not be updated`);
      }
      const column = updateMeta.entityMeta.columns.find(
        (column) => column.name === columnName,
      );

      if (!column) {
        throw new Error(
          `${updateMeta.entityMeta.name} has not column ${column.name}`,
        );
      }
      const ability = updateMeta.abilities.find(
        (ability) => ability.columnUuid === column.uuid,
      );

      if (ability) {
        relatedAbilites.push(ability);
      } else {
        throw new Error(
          `${this.magicService.me.name} has not ability to update ${updateMeta.entity} column ${column.name}`,
        );
      }
    }

    const whereSql = relatedAbilites
      .filter((ability) => ability.expression)
      .map((ability) => ability.expression)
      .join(' AND ');
    if (whereSql) {
      const queryResult = await this.magicService.query({
        entity: updateMeta.entity,
        where: whereSql + ` and id in (${updateMeta.ids.join(',')})`,
      });

      if (!queryResult.data?.length) {
        throw new Error(
          `${this.magicService.me.name} has not ability to update ${updateMeta.entity} some columns or instance not exist`,
        );
      }
    }
  }
}
