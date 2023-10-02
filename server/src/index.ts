import "reflect-metadata"
import express, {Request, Response} from 'express';
import cors from 'cors'
import { AppDataSource } from "./data-source";
import { FlowTest } from "./entities/FlowTest"

class App {

  app: express.Application
  port: number
  appDataSource = AppDataSource

  constructor() {
    this.app = express()
    this.port = 3500
  }

  initServer() {
      // to initialize the initial connection with the database, register all entities
      // and "synchronize" database schema, call "initialize()" method of a newly created database
      // once in your application bootstrap
      this.appDataSource.initialize()
      .then(() => {
          // here you can start to work with your database
          console.log('📦 [server]: Data Source has been initialized!')
      })
      .catch((error) => console.log('❌ [server]: Error during Data Source initialization:', error))

      this.app.use(cors())

      this.app.use(express.json({ limit: '50mb' }))
      this.app.use(express.urlencoded({ limit: '50mb', extended: true }))

      this.app.get('/', (req, res) => {
        res.send('Hello World!');
      });

      // Create FlowTest
      this.app.post('/api/v1/flowtest', async (req: Request, res: Response) => {
        const body = req.body
        const newFlowTest = new FlowTest()
        Object.assign(newFlowTest, body)

        const results = await this.appDataSource.getRepository(FlowTest).save(newFlowTest);

        return res.json(results);
      });

      // Get FlowTest
      this.app.get('/api/v1/flowtest/:id', async (req: Request, res: Response) => {
        const flowtest = await this.appDataSource.getRepository(FlowTest).findOneBy({
            id: req.params.id
        })
        if (flowtest) return res.json(flowtest)
        return res.status(404).send(`FlowTest ${req.params.id} not found`)
    })

      this.app.listen(this.port, () => {
        return console.log(`⚡️ [server]: FlowTest server is listening at http://localhost:${this.port}`);
      });
  }
}

let server = new App()
server.initServer()

