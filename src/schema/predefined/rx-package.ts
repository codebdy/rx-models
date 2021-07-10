import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const RxPackageSchema: EntitySchemaOptions<any> = {
  name: 'RxPackage',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uuid: {
      type: String,
    },
    name: {
      type: String,
    },
    entities: {
      type: 'simple-json',
      nullable: true,
    },
    diagrams: {
      type: 'simple-json',
      nullable: true,
    },
    relations: {
      type: 'simple-json',
      nullable: true,
    },
    status: {
      type: String,
      default: 'EDITING', //'EDITING' | 'SYNCED'
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
    updatedAt: {
      type: Date,
      createDate: true,
    },
  },
};
