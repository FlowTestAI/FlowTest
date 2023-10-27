import { DataSource } from 'typeorm'
import { AuthKey } from './entities/AuthKey';
import { Collection } from './entities/Collection';
import { FlowTest } from './entities/FlowTest';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ".flowtest",
    synchronize: true,
    logging: true,
    entities: [FlowTest, Collection, AuthKey],
    subscribers: [],
    migrations: [],
});
