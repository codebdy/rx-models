import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema<any>({
  name: 'RxUser',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    loginName: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    isSupper: {
      type: Boolean,
    },
    isDemo: {
      type: Boolean,
    },
    status: {
      type: String,
      default: 'NORMAL',
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
