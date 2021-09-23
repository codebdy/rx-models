import { JsonUnit } from '../base/json-unit';
import { DeleteMeta } from '../../magic-meta/delete/delete.meta';
import { MagicService } from 'magic-meta/magic.service';
import { DeleteDirectiveService } from 'directive/delete-directive.service';
import { AbilityService } from '../ability.service';
import { SchemaService } from 'schema/schema.service';

export class MagicDeleteParser {
  constructor(
    private readonly deleteDirectiveService: DeleteDirectiveService,
    private readonly magicService: MagicService,
    private readonly abilityService: AbilityService,
    public readonly schemaService: SchemaService,
  ) {}

  async parse(json: any) {
    const deleteMetas: DeleteMeta[] = [];
    for (const keyStr in json) {
      const value = json[keyStr];
      const jsonUnit = new JsonUnit(keyStr, value);
      const deleteMeta = new DeleteMeta(jsonUnit);
      const entityMeta = this.schemaService.getEntityMetaOrFailed(
        deleteMeta.entity,
      );
      const abilities = await this.abilityService.getEntityDeleteAbilities(
        entityMeta.uuid,
      );
      deleteMeta.abilities = abilities;

      for (const directiveMeta of jsonUnit.directives) {
        const DirectiveClass = this.deleteDirectiveService.findDirectiveOrFailed(
          directiveMeta.name,
        );
        deleteMeta.directives.push(
          new DirectiveClass(directiveMeta, this.magicService),
        );
      }

      deleteMetas.push(deleteMeta);
    }
    return deleteMetas;
  }
}
