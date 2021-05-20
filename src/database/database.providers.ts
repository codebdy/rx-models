import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: '101.37.18.208',
        port: 3306,
        username: 'username',
        password: 'password',
        database: 'usename',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
    }),
  },
];
