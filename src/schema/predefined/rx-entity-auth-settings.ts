import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const RxEntityAuthSettingsSchema: EntitySchemaOptions<any> = {
  name: 'RxEntityAuthSettings',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    entityUuid: {
      type: String,
    },
    expand: {
      type: Boolean,
      nullable: true,
    },
  },
};
