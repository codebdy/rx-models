import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const RxAbilitySchema: EntitySchemaOptions<any> = {
  name: 'RxAbility',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    entityUuid: {
      type: String,
    },
    columnUuid: {
      type: String,
      nullable: true,
    },
    abilityType: {
      type: String,
    },
    can: {
      type: Boolean,
    },
    expression: {
      type: String,
    },
  },
};
