import { DataSource } from 'typeorm'
import { Collection } from './entities/Collection';
import { FlowTest } from './entities/FlowTest';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ".flowtest",
    synchronize: true,
    logging: true,
    entities: [FlowTest, Collection],
    subscribers: [],
    migrations: [],
});
