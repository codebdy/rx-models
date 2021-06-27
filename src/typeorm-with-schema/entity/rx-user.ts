import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema<any>({
  name: 'RxUser',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    content: {
      type: String,
    },
    title: {
      type: String,
    },
  },
});
