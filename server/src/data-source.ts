import { DataSource } from 'typeorm';
import { Collection } from './entities/Collection';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: '.flowtest',
  synchronize: true,
  logging: false,
  entities: [Collection],
  subscribers: [],
  migrations: [],
});
