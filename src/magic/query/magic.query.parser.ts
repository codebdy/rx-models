import { CommandMeta } from 'src/command/command.meta';
import { QueryCommandService } from 'src/command/query-command.service';
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
    private readonly queryCommandService: QueryCommandService,
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
        jsonUnit.commands.forEach((commandMeta) => {
          if (commandMeta.name === TOKEN_GET_ONE) {
            meta.fetchString = TOKEN_GET_ONE;
          } else if (commandMeta.name === TOKEN_GET_MANY) {
            meta.fetchString = TOKEN_GET_MANY;
          } else {
            const commandClass = this.queryCommandService.findEntityCommandOrFailed(
              commandMeta.name,
            );
            const command = new commandClass(
              commandMeta,
              this.rootMeta,
              this.magicService,
              this.schemaService,
            );
            meta.pushCommand(command);
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
          const relation = new QueryRelationMeta();
          relation.entityMeta = this.schemaService.getRelationEntityMetaOrFailed(
            relationInfo.name,
            meta.entity,
          );
          relation.name = relationInfo.name;
          relation.parentEntityMeta = meta;
          meta.addonRelations.push(relation);
        }
      }
    }
  }

  async parseOtherMeta(json: any, meta: QueryEntityMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      await this.parseOneLine(jsonUnit, meta, keyStr.trim());
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
      this.paseConditionCommand(jsonUnit, meta);
    }
  }

  private paseConditionCommand(jsonUnit: JsonUnit, meta: QueryEntityMeta) {
    let commanName = 'equal';
    let commandMeta: CommandMeta;
    if (jsonUnit.commands && jsonUnit.commands.length > 0) {
      commanName = jsonUnit.commands[0].name;
      commandMeta = jsonUnit.commands[0];
      commandMeta.value = jsonUnit.value;
    }
    const commandClass = this.queryCommandService.findConditionCommandOrFailed(
      commanName,
    );

    meta.pushCommand(
      new commandClass(
        commandMeta ? commandMeta : new CommandMeta(commanName, jsonUnit.value),
        this.rootMeta,
        meta,
        jsonUnit.key,
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
    const cmdMeta = new CommandMeta(name);
    cmdMeta.value = jsonUnit.value;

    if (meta instanceof QueryRootMeta) {
      const cmdClass = this.queryCommandService.findEntityCommandOrFailed(name);
      meta.pushCommand(
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
      meta.pushCommand(
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
    jsonUnit.commands.forEach((commandMeta) => {
      const CommandClass = this.queryCommandService.findRelationCommandOrFailed(
        commandMeta.name,
      );
      relation.pushCommand(
        new CommandClass(
          commandMeta,
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
