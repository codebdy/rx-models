import { EntitySchema } from 'typeorm';

export const RxMediaEntity = new EntitySchema<any>({
  name: 'RxMedia',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      nullable: true,
    },
    mimetype: {
      type: String,
      nullable: true,
    },
    fileName: {
      type: String,
    },
    path: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
});
