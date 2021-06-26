import { CommandService } from 'src/command/command.service';
import { QueryCommand } from 'src/command/query-command';
import { RelationMeta } from 'src/meta/query/relation-meta';
import { TypeOrmWithSchemaService } from 'src/typeorm-with-schema/typeorm-with-schema.service';
import { QueryMeta } from '../../meta/query/query-meta';
import { JsonUnit } from '../base/json-unit';
import { TOKEN_GET_ONE } from '../base/tokens';

export class MagicQueryParser {
  private querMeta: QueryMeta;
  constructor(
    private readonly commandService: CommandService,
    private readonly typeOrmService: TypeOrmWithSchemaService,
  ) {}

  parse(jsonStr: string): QueryMeta {
    const json = JSON.parse(jsonStr || '{}');
    const meta = new QueryMeta();
    this.querMeta = meta;
    this.parseModelLine(json, meta);
    this.parseMeta(json, meta);
    return meta;
  }

  parseModelLine(json: any, meta: QueryMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      if (jsonUnit.isModel()) {
        meta.model = json.value;
        jsonUnit.commands.forEach((commandMeta) => {
          if (commandMeta.name?.toLowerCase() === TOKEN_GET_ONE) {
            meta.fetchString = TOKEN_GET_ONE;
          } else {
            const commandClass = this.commandService.findModelCommandOrFailed(
              commandMeta.name,
            );
            const command = commandClass(
              commandMeta,
              this.querMeta,
            ) as QueryCommand;
            command.isEffectResultCount
              ? meta.effectCountModelCommands.push(command)
              : meta.notEffectCountModelCommands.push(command);
          }
        });

        delete json[keyStr];
      }
    }
  }

  parseMeta(json: any, meta: QueryMeta | RelationMeta) {
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const relationEntitySchemaOptions = this.typeOrmService.findRelationEntitySchema(
        meta.model,
        jsonUnit.key,
      );
      //如果是关联
      if (relationEntitySchemaOptions) {
        const relation = new RelationMeta();
        relation.name = jsonUnit.key;
        relation.entitySchema = this.typeOrmService.findEntitySchemaOrFailed(
          relationEntitySchemaOptions.target.toString(),
        );
        jsonUnit.commands.forEach((commandMeta) => {
          const commandClass = this.commandService.findRelationCommandOrFailed(
            commandMeta.name,
          );
          relation.relationCommands.push(
            commandClass(commandMeta, this.querMeta),
          );
        });
        this.parseMeta(value, relation);
      }
    }
  }
}
