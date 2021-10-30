import { parseUpdateRelationsFromWhere } from 'src/magic-meta/update/parse-condition-relations-from-where';
import { UpdateEntityOrRelationMeta } from 'src/magic-meta/update/update.entity-or-relation-meta';
import { EntityMeta } from 'src/schema/graph-meta-interface/entity-meta';
import { SchemaService } from 'src/schema/schema.service';
import { UpdateMeta } from '../../magic-meta/update/update.meta';
import { AbilityService } from '../ability.service';
import { TOKEN_IDS, TOKEN_WHERE } from '../base/tokens';
export class MagicUpdateParser {
  constructor(
    private readonly schemaService: SchemaService,
    private readonly abilityService: AbilityService,
  ) {}

  async parse(json: any) {
    const metas: UpdateMeta[] = [];
    for (const keyStr in json) {
      const entityMeta = this.schemaService.getEntityMetaOrFailed(
        keyStr.trim(),
      );
      const abilities = await this.abilityService.getEntityPostAbilities(
        entityMeta.uuid,
      );
      const expand = await this.abilityService.isEntityExpand(entityMeta.uuid);
      const updateMeta = this.parseOneEntity(entityMeta, json[keyStr]);
      updateMeta.abilities = abilities;
      updateMeta.expandFieldForAuth = expand;
      metas.push(updateMeta);
    }
    return metas;
  }

  parseOneEntity(entityMeta: EntityMeta, json: any) {
    const updateMeta = new UpdateMeta();

    updateMeta.entityMeta = entityMeta;
    updateMeta.rootMeta = new UpdateEntityOrRelationMeta(entityMeta);
    for (const keyStr in json) {
      const value = json[keyStr];
      if (keyStr.trim().toLowerCase() === TOKEN_IDS) {
        updateMeta.ids = value;
      }
      if (keyStr.replace('@', '').trim() === TOKEN_WHERE) {
        parseUpdateRelationsFromWhere(
          updateMeta.rootMeta,
          value,
          this.schemaService,
        );
      } else {
        updateMeta.columns[keyStr] = value;
      }
    }

    return updateMeta;
  }
}
