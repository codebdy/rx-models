import { SchemaService } from 'src/schema/schema.service';
import { ModelUpdateMeta } from '../../magic-meta/update/model.update.meta';
import { AbilityService } from '../ability.service';
export class MagicUpdateParser {
  constructor(
    private readonly schemaService: SchemaService,
    private readonly abilityService: AbilityService,
  ) {}

  async parse(json: any) {
    const metas: ModelUpdateMeta[] = [];
    for (const keyStr in json) {
      const entityMeta = this.schemaService.getEntityMetaOrFailed(
        keyStr.trim(),
      );
      const abilities = await this.abilityService.getEntityPostAbilities(
        entityMeta.uuid,
      );
      const expand = await this.abilityService.isEntityExpand(entityMeta.uuid);
      const updateMeta = new ModelUpdateMeta(entityMeta, json[keyStr]);
      updateMeta.abilities = abilities;
      updateMeta.expandFieldForAuth = expand;
      metas.push(updateMeta);
    }
    return metas;
  }
}
