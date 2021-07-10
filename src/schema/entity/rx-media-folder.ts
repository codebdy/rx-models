import { EntitySchema } from 'typeorm';
import { MANY_TO_ONE, ONE_TO_MANY, ONE_TO_ONE } from './consts';

export const RxMediaFolderEntity = new EntitySchema<any>({
  name: 'RxMediaFolder',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    order: {
      type: Number,
      nullable: true,
    },
  },
  relations: {
    user: {
      type: ONE_TO_ONE,
      target: 'RxUser',
      joinColumn: true,
    },
    parent: {
      type: MANY_TO_ONE,
      target: 'RxMediaFolder',
      joinColumn: true,
    },
    children: {
      type: ONE_TO_MANY,
      target: 'RxMediaFolder',
    },
  },
});
