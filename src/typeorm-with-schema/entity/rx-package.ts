import { EntitySchema } from 'typeorm';

export const PackageEntity = new EntitySchema<any>({
  name: 'RxPackage',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uuid: {
      type: Number,
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
});
