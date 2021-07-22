import { DirectiveMeta } from 'src/directive/directive.meta';
import { QueryDirectiveService } from 'src/directive/query-directive.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { parseRelationsFromWhereSql } from 'src/magic-meta/query/parse-relations-from-where-sql';
import { QueryEntityMeta } from 'src/magic-meta/query/query.entity-meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { QueryRootMeta } from 'src/magic-meta/query/query.root-meta';
import { SchemaService } from 'src/schema/schema.service';
import { EntitySchemaRelationOptions } from 'typeorm';
import { AbilityService } from '../ability.service';
import { JsonUnit } from '../base/json-unit';
import {
  TOKEN_GET_MANY,
  TOKEN_GET_ONE,
  TOKEN_ON,
  TOKEN_ORDER_BY,
  TOKEN_SELECT,
  TOKEN_WHERE,
} from '../base/tokens';

export class MagicQueryParser {
  private rootMeta: QueryRootMeta;
  constructor(
    private readonly queryCommandService: QueryDirectiveService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
    private readonly abilityService: AbilityService,
  ) {}

  async parse(json: any): Promise<QueryRootMeta> {
    const meta = new QueryRootMeta();
    this.rootMeta = meta;
    this.parseEntityLine(json, meta);
    await this.parseQueryAbilities(meta);
    await this.parseOtherMeta(json, meta);
    return meta;
  }

  parseEntityLine(json: any, meta: QueryRootMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      if (jsonUnit.isModel()) {
        meta.entityMeta = this.schemaService.getEntityMetaOrFailed(
          (jsonUnit.value as string).trim(),
        );
        jsonUnit.commands.forEach((directiveMeta) => {
          if (directiveMeta.name === TOKEN_GET_ONE) {
            meta.fetchString = TOKEN_GET_ONE;
          } else if (directiveMeta.name === TOKEN_GET_MANY) {
            meta.fetchString = TOKEN_GET_MANY;
          } else {
            const directiveClass = this.queryCommandService.findEntityCommandOrFailed(
              directiveMeta.name,
            );
            const command = new directiveClass(
              directiveMeta,
              this.rootMeta,
              this.magicService,
              this.schemaService,
            );
            meta.pushDirective(command);
          }
        });

        delete json[keyStr];
        return meta;
      }
    }

    throw Error('Not give entity');
  }

  async parseQueryAbilities(meta: QueryEntityMeta) {
    meta.expandFieldForAuth = await this.abilityService.isEntityExpand(
      meta.entityMeta.uuid,
    );

    meta.abilities = await this.abilityService.getEntityQueryAbilities(
      meta.entityMeta.uuid,
    );
    //添加权限用到的关联
    for (const ability of meta.abilities) {
      if (ability.expression) {
        const relationInfos = parseRelationsFromWhereSql(ability.expression);
        meta.addonRelationInfos.push(...relationInfos);
        for (const relationInfo of relationInfos) {
          this.createAddonRelation(relationInfo.name, meta);
        }
      }
    }
  }

  private createAddonRelation(relationName: string, meta: QueryEntityMeta) {
    const relation = new QueryRelationMeta();
    relation.entityMeta = this.schemaService.getRelationEntityMetaOrFailed(
      relationName,
      meta.entity,
    );
    relation.name = relationName;
    relation.parentEntityMeta = meta;
    meta.addAddOnRelation(relation);
    return relation;
  }

  async parseOtherMeta(json: any, meta: QueryEntityMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      await this.parseOneLine(jsonUnit, meta, keyStr.trim());
    }
    for (const relationCondition of meta.relationConditions) {
      const [relationName, fieldName] = relationCondition.key.split('.');
      let relation = meta.findRelation(relationName);
      if (!relation) {
        relation = this.createAddonRelation(relationName, meta);
      }

      this.paseConditionCommand(
        relationCondition,
        meta,
        relation.alias + '.' + fieldName,
      );
    }
  }

  private async parseOneLine(
    jsonUnit: JsonUnit,
    meta: QueryEntityMeta,
    keyStr: string,
  ) {
    const relationEntitySchemaOptions = this.schemaService.findRelationEntitySchema(
      meta.entityMeta.name,
      jsonUnit.key,
    );
    const keyWithoutAt = keyStr.replace('@', '');
    //如果是关联
    if (relationEntitySchemaOptions) {
      await this.parseRelation(jsonUnit, relationEntitySchemaOptions, meta);
    } else if (
      keyWithoutAt === TOKEN_GET_ONE &&
      meta instanceof QueryRootMeta
    ) {
      meta.fetchString = TOKEN_GET_ONE;
    } else if (
      keyWithoutAt === TOKEN_ON ||
      keyWithoutAt === TOKEN_WHERE ||
      keyWithoutAt === TOKEN_SELECT ||
      keyWithoutAt === TOKEN_ORDER_BY ||
      keyStr.startsWith('@')
    ) {
      this.parseEntityOrRelationCommand(keyWithoutAt, jsonUnit, meta);
    } else {
      //剩下的全是条件行
      if (jsonUnit.key.split('.').length > 1) {
        meta.relationConditions.push(jsonUnit);
      } else {
        this.paseConditionCommand(
          jsonUnit,
          meta,
          meta.alias + '.' + jsonUnit.key,
        );
      }
    }
  }

  private paseConditionCommand(
    jsonUnit: JsonUnit,
    meta: QueryEntityMeta,
    field: string,
  ) {
    let directiveMeta: DirectiveMeta;
    let commanName = 'equal';
    if (jsonUnit.commands && jsonUnit.commands.length > 0) {
      commanName = jsonUnit.commands[0].name;
      directiveMeta = jsonUnit.commands[0];
      directiveMeta.value = jsonUnit.value;
    }
    const directiveClass = this.queryCommandService.findConditionCommandOrFailed(
      commanName,
    );

    meta.pushDirective(
      new directiveClass(
        directiveMeta ? directiveMeta : new DirectiveMeta(commanName, jsonUnit.value),
        this.rootMeta,
        meta,
        field,
        this.magicService,
        this.schemaService,
      ),
    );
  }

  private parseEntityOrRelationCommand(
    name: string,
    jsonUnit: JsonUnit,
    meta: QueryEntityMeta,
  ) {
    const cmdMeta = new DirectiveMeta(name);
    cmdMeta.value = jsonUnit.value;

    if (meta instanceof QueryRootMeta) {
      const cmdClass = this.queryCommandService.findEntityCommandOrFailed(name);
      meta.pushDirective(
        new cmdClass(
          cmdMeta,
          this.rootMeta,
          this.magicService,
          this.schemaService,
        ),
      );
    } else {
      const cmdClass = this.queryCommandService.findRelationCommandOrFailed(
        name,
      );
      meta.pushDirective(
        new cmdClass(
          cmdMeta,
          this.rootMeta,
          meta as QueryRelationMeta,
          this.magicService,
          this.schemaService,
        ),
      );
    }
  }

  private async parseRelation(
    jsonUnit: JsonUnit,
    relationEntitySchemaOptions: EntitySchemaRelationOptions,
    parentMeta: QueryEntityMeta,
  ) {
    const relation = new QueryRelationMeta();
    parentMeta.relations.push(relation);

    relation.parentEntityMeta = parentMeta;
    relation.name = jsonUnit.key;
    relation.entityMeta = this.schemaService.getEntityMetaOrFailed(
      relationEntitySchemaOptions.target.toString(),
    );
    jsonUnit.commands.forEach((directiveMeta) => {
      const CommandClass = this.queryCommandService.findRelationCommandOrFailed(
        directiveMeta.name,
      );
      relation.pushDirective(
        new CommandClass(
          directiveMeta,
          this.rootMeta,
          this.magicService,
          this.schemaService,
        ),
      );
    });
    await this.parseQueryAbilities(relation);
    await this.parseOtherMeta(jsonUnit.value, relation);
  }
}
