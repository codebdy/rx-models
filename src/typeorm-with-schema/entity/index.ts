import { EntitySchema } from 'typeorm';
import { RxMediaFolderEntity } from './rx-media-folder';
import { UserEntity } from './rx-user';

export const predefinedEntities = [
  new EntitySchema<any>({
    name: 'RxTest',
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
      },
      title: {
        type: String,
      },
    },
  }),
  UserEntity,
  RxMediaFolderEntity,
];
