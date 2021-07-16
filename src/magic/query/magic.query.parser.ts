import { CommandMeta } from 'src/command/command.meta';
import { QueryCommandService } from 'src/command/query-command.service';
import { MagicService } from 'src/magic-meta/magic.service';
import { parseRelationsFromWhereSql } from 'src/magic-meta/query/parse-relations-from-where-sql';
import { QueryMeta } from 'src/magic-meta/query/query.meta';
import { QueryRelationMeta } from 'src/magic-meta/query/query.relation-meta';
import { SchemaService } from 'src/schema/schema.service';
import { EntitySchemaRelationOptions } from 'typeorm';
import { QueryEntityMeta } from '../../magic-meta/query/query.entity-meta';
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
  private querMeta: QueryEntityMeta;
  constructor(
    private readonly queryCommandService: QueryCommandService,
    private readonly schemaService: SchemaService,
    private readonly magicService: MagicService,
  ) {}

  parse(json: any): QueryEntityMeta {
    const meta = new QueryEntityMeta();
    this.querMeta = meta;
    this.parseModelLine(json, meta);
    this.parseMeta(json, meta);
    return meta;
  }

  parseModelLine(json: any, meta: QueryEntityMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      if (jsonUnit.isModel()) {
        meta.entity = jsonUnit.value;
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
              this.querMeta,
              this.magicService,
            );
            meta.pushCommand(command);
          }
        });

        delete json[keyStr];
        return;
      }
    }

    throw Error('Not give entity');
  }

  parseMeta(json: any, meta: QueryMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      this.parseOneLine(jsonUnit, meta, keyStr.trim());
    }
  }

  parseOneLine(jsonUnit: JsonUnit, meta: QueryMeta, keyStr: string) {
    const relationEntitySchemaOptions = this.schemaService.findRelationEntitySchema(
      meta.entity,
      jsonUnit.key,
    );
    const keyWithoutAt = keyStr.replace('@', '');
    //如果是关联
    if (relationEntitySchemaOptions) {
      this.parseRelation(jsonUnit, relationEntitySchemaOptions, meta);
    } else if (
      keyWithoutAt === TOKEN_GET_ONE &&
      meta instanceof QueryEntityMeta
    ) {
      meta.fetchString = TOKEN_GET_ONE;
    } //如果是On或者Where指令，添加指令用到的的关联
    else if (keyWithoutAt === TOKEN_ON || keyWithoutAt === TOKEN_WHERE) {
      const relationNames = parseRelationsFromWhereSql(jsonUnit.value);
      relationNames?.forEach((roleName) => {
        this.parseOneLine(new JsonUnit(roleName, {}), meta, roleName);
      });
      this.parseModelOrRelationCommand(keyWithoutAt, jsonUnit, meta);
    } else if (
      keyWithoutAt === TOKEN_SELECT ||
      keyWithoutAt === TOKEN_ORDER_BY ||
      keyStr.startsWith('@')
    ) {
      this.parseModelOrRelationCommand(keyWithoutAt, jsonUnit, meta);
    } else {
      //剩下的全是条件行
      this.paseConditionCommand(jsonUnit, meta);
    }
  }

  private paseConditionCommand(jsonUnit: JsonUnit, meta: QueryMeta) {
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

    meta.pushConditionCommand(
      new commandClass(
        commandMeta ? commandMeta : new CommandMeta(commanName, jsonUnit.value),
        this.querMeta,
        meta,
        jsonUnit.key,
        this.magicService,
      ),
    );
  }

  private parseModelOrRelationCommand(
    name: string,
    jsonUnit: JsonUnit,
    meta: QueryMeta,
  ) {
    const cmdMeta = new CommandMeta(name);
    cmdMeta.value = jsonUnit.value;

    if (meta instanceof QueryEntityMeta) {
      const cmdClass = this.queryCommandService.findEntityCommandOrFailed(name);
      meta.pushCommand(new cmdClass(cmdMeta, this.querMeta, this.magicService));
    } else {
      const cmdClass = this.queryCommandService.findRelationCommandOrFailed(
        name,
      );
      meta.pushCommand(
        new cmdClass(
          cmdMeta,
          this.querMeta,
          meta as QueryRelationMeta,
          this.magicService,
        ),
      );
    }
  }

  private parseRelation(
    jsonUnit: JsonUnit,
    relationEntitySchemaOptions: EntitySchemaRelationOptions,
    parentMeta: QueryMeta,
  ) {
    //如果关联已经存在，则不再创建新的关联，直接合并他们的数据
    const existRelation = parentMeta.relationMetas.find(
      (relation) => relation.name === jsonUnit.key,
    );
    const relation = existRelation ? existRelation : new QueryRelationMeta();
    !existRelation && parentMeta.relationMetas.push(relation);

    relation.parentEntityMeta = parentMeta;
    relation.name = jsonUnit.key;
    relation.entitySchema = this.schemaService.findEntitySchemaOrFailed(
      relationEntitySchemaOptions.target.toString(),
    );
    jsonUnit.commands.forEach((commandMeta) => {
      const CommandClass = this.queryCommandService.findRelationCommandOrFailed(
        commandMeta.name,
      );
      relation.pushCommand(
        new CommandClass(commandMeta, this.querMeta, this.magicService),
      );
    });
    this.parseMeta(jsonUnit.value, relation);
  }
}
