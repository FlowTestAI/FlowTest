import "reflect-metadata"
import express, {Request, Response} from 'express';
import cors from 'cors'
import { AppDataSource } from "./data-source";
import { FlowTest } from "./entities/FlowTest"
import SwaggerParser from '@apidevtools/swagger-parser';
import { Collection } from "./entities/Collection";
import multer from 'multer';

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
      this.app.use(express.raw({ limit: '50mb' }))
      this.app.use(express.text({ limit: '50mb' }))
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

      // Update FlowTest
      this.app.put('/api/v1/flowtest/:id', async (req: Request, res: Response) => {
        const flowtest = await this.appDataSource.getRepository(FlowTest).findOneBy({
            id: req.params.id
        })
        if (flowtest) {
          const body = req.body
          const updateFlowTest = new FlowTest()
          Object.assign(updateFlowTest, body)
          flowtest.name = updateFlowTest.name
          flowtest.flowData = updateFlowTest.flowData

          const result = await this.appDataSource.getRepository(FlowTest).save(flowtest)

          return res.json(result)
        }
        return res.status(404).send(`FlowTest ${req.params.id} not found`)
      })

      // Get FlowTest
      this.app.get('/api/v1/flowtest/:id', async (req: Request, res: Response) => {
        const flowtest = await this.appDataSource.getRepository(FlowTest).findOneBy({
            id: req.params.id
        })
        if (flowtest) return res.json(flowtest)
        return res.status(404).send(`FlowTest ${req.params.id} not found`)
      })

      // Get All FlowTest
      this.app.get('/api/v1/flowtest', async (req: Request, res: Response) => {
        const flowtests = await this.appDataSource.getRepository(FlowTest).find();
        if (flowtests) return res.json(flowtests)
        return res.status(404).send('Error in fetching saved flowtests')
      })

      // Create collection
      const parseCollection = (collection) => {
        return '';
      }

      const upload = multer({ dest: 'uploads/' })
      this.app.post('/api/v1/collection', upload.single('file'), (req: Request, res: Response) => {
        console.log(req.file)
        SwaggerParser.validate(req.file.path, async (err, api) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to parse openapi spec');
          } else {
            console.log("API name: %s, Version: %s", api.info.title, api.info.version);
            const newCollection = new Collection()
            const constructCollection = {
              name: api.info.title,
              collection: api,
              nodes: parseCollection(api)
            }
            Object.assign(newCollection, constructCollection)

            const results = await this.appDataSource.getRepository(Collection).save(newCollection);

            return res.json(results);
          }
        });
      })

      // Get all collections
      this.app.get('/api/v1/collection', async (req: Request, res: Response) => {
        const collections = await this.appDataSource.getRepository(Collection).find();
        if (collections) return res.json(collections)
        return res.status(404).send('Error in fetching saved collections')
      })

      this.app.listen(this.port, () => {
        return console.log(`⚡️ [server]: FlowTest server is listening at http://localhost:${this.port}`);
      });

  }
}

let server = new App()
server.initServer()

