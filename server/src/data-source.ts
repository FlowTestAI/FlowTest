import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ".flowtest",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
});

// const initDatabase = async(): Promise<void> => {
//     // Initialize database
//     AppDataSource.initialize()
//         .then(async () => {
//             console.log('📦 [server]: Data Source has been initialized!')
//         })
//         .catch((err) => {
//             console.log('❌ [server]: Error during Data Source initialization:', err)
//         })
// }

// const db = await initDatabase()