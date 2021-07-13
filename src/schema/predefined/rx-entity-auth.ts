import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const RxEntityAuthSchema: EntitySchemaOptions<any> = {
  name: 'RxEntityAuth',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uuid: {
      type: String,
    },
    conditions: {
      type: 'simple-json',
    },
  },
};
