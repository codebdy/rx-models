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
    conditionUuid: {
      type: String,
      nullable: true,
    },
    canRead: {
      type: Boolean,
    },
    canCreate: {
      type: Boolean,
    },
    canUpdate: {
      type: Boolean,
    },
    canDelete: {
      type: Boolean,
    },
  },
};
