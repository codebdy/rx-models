import { Injectable } from '@nestjs/common';
import { CommandMeta } from 'src/command/command.meta';
import { QueryCommandService } from 'src/command/query-command.service';
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

@Injectable()
export class MagicQueryParser {
  private querMeta: QueryEntityMeta;
  constructor(
    private readonly commandService: QueryCommandService,
    private readonly schemaService: SchemaService,
  ) {}

  parse(jsonStr: string): QueryEntityMeta {
    const json = JSON.parse(jsonStr || '{}');
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
            const commandClass = this.commandService.findEntityCommandOrFailed(
              commandMeta.name,
            );
            const command = new commandClass(commandMeta, this.querMeta);
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
      //如果是model指令或者relation指令
      keyWithoutAt === TOKEN_ON ||
      keyWithoutAt === TOKEN_WHERE ||
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
    const commandClass = this.commandService.findConditionCommandOrFailed(
      commanName,
    );

    meta.pushConditionCommand(
      new commandClass(
        commandMeta ? commandMeta : new CommandMeta(commanName, jsonUnit.value),
        this.querMeta,
        meta,
        jsonUnit.key,
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
      const cmdClass = this.commandService.findEntityCommandOrFailed(name);
      meta.pushCommand(new cmdClass(cmdMeta, this.querMeta));
    } else {
      const cmdClass = this.commandService.findRelationCommandOrFailed(name);
      meta.pushCommand(
        new cmdClass(cmdMeta, this.querMeta, meta as QueryRelationMeta),
      );
    }
  }

  private parseRelation(
    jsonUnit: JsonUnit,
    relationEntitySchemaOptions: EntitySchemaRelationOptions,
    parentMeta: QueryMeta,
  ) {
    const relation = new QueryRelationMeta();
    relation.parentEntityMeta = parentMeta;
    parentMeta.relationMetas.push(relation);
    relation.name = jsonUnit.key;
    relation.entitySchema = this.schemaService.findEntitySchemaOrFailed(
      relationEntitySchemaOptions.target.toString(),
    );
    jsonUnit.commands.forEach((commandMeta) => {
      const CommandClass = this.commandService.findRelationCommandOrFailed(
        commandMeta.name,
      );
      relation.pushCommand(new CommandClass(commandMeta, this.querMeta));
    });
    this.parseMeta(jsonUnit.value, relation);
  }
}
