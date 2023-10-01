import { DataSource } from 'typeorm'
import { FlowTest } from './entities/FlowTest';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ".flowtest",
    synchronize: true,
    logging: true,
    entities: [FlowTest],
    subscribers: [],
    migrations: [],
});
