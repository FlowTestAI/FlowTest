import "reflect-metadata"
import express, {Request, Response} from 'express';
import path from 'path';
import cors from 'cors'
import { AppDataSource } from "./data-source";
import { FlowTest } from "./entities/FlowTest"
import SwaggerParser from '@apidevtools/swagger-parser';
import { Collection } from "./entities/Collection";
import multer from 'multer';
import * as fs from 'fs';
import CollectionUtil from "./collection-util";
import { AuthKey } from "./entities/AuthKey";
import JsonRefs from 'json-refs'
import FlowtestAI from "./flowtest-ai";
import axios from "axios";
import createDirectory from "./controllers/file-manager/create-directory";
import deleteDirectory from "./controllers/file-manager/delete-directory";
import createFile from "./controllers/file-manager/create-file";
import makeNode from "./controllers/file-manager/Node";
import concatRoute from "./controllers/file-manager/util/concat-route";
import deleteFile from "./controllers/file-manager/delete-file";
import upadateFile from "./controllers/file-manager/update-file";
import readFile from "./controllers/file-manager/read-file";
import { Watcher } from "./collections/watcher";
import { isDirectory } from "./controllers/file-manager/util/file-util";

class App {

  app: express.Application
  port: number
  appDataSource = AppDataSource
  collectionUtil: CollectionUtil
  timeout: number
  watcher: Watcher

  constructor() {
    this.app = express()
    this.port = 3500
    this.collectionUtil = new CollectionUtil()
    this.timeout = 60000
    this.watcher = new Watcher()
  }

  private newAbortSignal() {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), this.timeout || 0);
  
    return abortController.signal;
  }

  /** web platform: blob. */
  private async convertBase64ToBlob(base64: string) {
    const response = await fetch(base64);
    const blob = await response.blob();
    return blob;
  };

  private async createCollectionObj(path: string, rootPath: string) {
    const spec = fs.readFileSync(path, 'utf8');
    // async/await syntax
    let api = await SwaggerParser.validate(path);
    // console.log("API name: %s, Version: %s", api.info.title, api.info.version);

    // resolve references in openapi spec
    const resolvedSpec = await JsonRefs.resolveRefs(api);
    const parsedNodes = await this.collectionUtil.parse(resolvedSpec.resolved)

    const constructCollection = {
      name: api.info.title,
      collection: spec,
      nodes: JSON.stringify(parsedNodes),
      rootPath: rootPath
    }

    return constructCollection;
  }

  private async addWatchersForExsistingCollections() {
      const collections = await this.appDataSource.getRepository(Collection).find();
      collections.forEach(async collection => {
        const fullPath = concatRoute(collection.rootPath, collection.name)
        // collection folder might have been deleted externally
        if (isDirectory(fullPath)) {
          const collectionObj = {
            version: '1',
            uid: collection.id,
            name: collection.name,
            pathname: fullPath,
            items: []
          };
          // dispatch create collection first
          this.watcher.addWatcher(fullPath, collection.id)
          console.log(`Watcher added for path: ${fullPath}`)
        } else {
          const result = await this.appDataSource.getRepository(Collection).remove(collection)
          console.log(`Deleted collection: ${result.name}`)
        }
      })
  }

  // private async initSamples() {
  //   // collection
  //   const collections = await this.appDataSource.getRepository(Collection).find();
  //   const sample_collection = collections.find((collection) => collection.name === "Swagger Petstore - OpenAPI 3.0")
  //   if (sample_collection === undefined) {
  //     await this.createCollection('src/samples/collection/petstore.yaml');
  //   }

  //   // flows
  //   const flowtests = await this.appDataSource.getRepository(FlowTest).find();
  //   const sample_flow = flowtests.find((flowtest) => flowtest.name === "flow_1")
  //   if (sample_flow === undefined) {
  //     const flowData = fs.readFileSync('src/samples/flow/flow_1.json', 'utf8');
  //     const newFlowTestBody = {
  //       name: "flow_1",
  //       flowData
  //     }
  //     const newFlowTest = new FlowTest()
  //     Object.assign(newFlowTest, newFlowTestBody)

  //     await this.appDataSource.getRepository(FlowTest).save(newFlowTest);
  //     console.log(`Created sample flow: flow_1`)
  //   }
  // }

  initServer() {
      // to initialize the initial connection with the database, register all entities
      // and "synchronize" database schema, call "initialize()" method of a newly created database
      // once in your application bootstrap
      this.appDataSource.initialize()
        .then(() => {
            // here you can start to work with your database
            console.log('📦 [server]: Data Source has been initialized!')
            this.addWatchersForExsistingCollections();
            // this.initSamples();
        })
        .catch((error) => console.log('❌ [server]: Error during Data Source initialization:', error))

      this.app.use(cors())

      this.app.use(express.json({ limit: '50mb' }))
      this.app.use(express.raw({ limit: '50mb' }))
      this.app.use(express.text({ limit: '50mb' }))
      this.app.use(express.urlencoded({ limit: '50mb', extended: true }))

      // Have Node serve the files for our built React app
      this.app.use(express.static(path.resolve(__dirname, '../../../build')));

      // Create FlowTest
      this.app.post('/api/v1/flowtest', async (req: Request, res: Response) => {
        const body = req.body
        const newFlowTest = new FlowTest()
        Object.assign(newFlowTest, body)

        const result = await this.appDataSource.getRepository(FlowTest).save(newFlowTest);
        console.log(`Created flow: ${result.name}`)

        return res.json(result);
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
          console.log(`Updated flow: ${result.name}`)

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

      // Delete FlowTest
      this.app.delete('/api/v1/flowtest/:id', async (req: Request, res: Response) => {
        const flowtest = await this.appDataSource.getRepository(FlowTest).findOneBy({
          id: req.params.id
        })

        if (flowtest) {
          const result = await this.appDataSource.getRepository(FlowTest).remove(flowtest)
          console.log(`Deleted flow: ${result.name}`)
          return res.json(result)
        }
        return res.status(404).send(`FlowTest ${req.params.id} not found`)
      })

      // This endpoint acts as a proxy to route request without origin header for cross-origin requests
      this.app.put('/api/v1/request', async (req: Request, res: Response) => {
        try {
            if (req.body.headers['Content-type'] === 'multipart/form-data') {
              const requestData = new FormData();
              const file = await this.convertBase64ToBlob(req.body.data.value);
              requestData.append(req.body.data.key, file, req.body.data.name)
            
              req.body.data = requestData;
            }
            
            // assuming 'application/json' type
            const options = {
              ...req.body,
              signal: this.newAbortSignal()
            }
            
            const result = await axios(options);
            return res.status(200).send(result.data);
        } catch(error) {
            if (error.code === "ERR_CANCELED") {
              //timeout
              return res.status(408).send(error)
            }
            else if (error.code === "ENOTFOUND") {
              return res.status(404).send(error)
            }
            else if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              return res.status(error.response.status).send(error.response.data);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              return res.status(503).send(error.request);
            } else if (error.message) {
              // Something happened in setting up the request that triggered an Error
              return res.status(400).send(error.message);
            } else {
              // Something not related to axios request
              return res.status(500).send(error);
            }
        }
      })

      // Get All FlowTest
      this.app.get('/api/v1/flowtest', async (req: Request, res: Response) => {
        const flowtests = await this.appDataSource.getRepository(FlowTest).find();
        if (flowtests) return res.json(flowtests)
        return res.status(404).send('Error in fetching saved flowtests')
      })

      // Create collection
      const upload = multer({ dest: 'uploads/' })
      this.app.post('/api/v1/collection', upload.single('file'), async (req: Request, res: Response) => {
        console.debug(req.file)
        try {
          const constructCollection = await this.createCollectionObj(req.file.path, req.body.rootPath);
          const newCollection = new Collection()
          Object.assign(newCollection, constructCollection)

          const dirResult = createDirectory(newCollection.name, newCollection.rootPath)
          console.log(dirResult.message)

          if (dirResult.status === 201) {
            const collection = await this.appDataSource.getRepository(Collection).save(newCollection);
            console.log(`Created collection: ${collection.name}`)
            this.watcher.addWatcher(concatRoute(collection.rootPath, collection.name), collection.id)
            console.log(`Watcher added for path: ${concatRoute(collection.rootPath, collection.name)}`)
            return res.status(201).send(collection)
          } else {
            return res.status(dirResult.status).send(dirResult.message);
          }
        } catch(err) {
          console.error(err);
          return res.status(500).send('Failed to parse OpenAPI spec');
        }
      })

      // Delete collections
      this.app.delete('/api/v1/collection/:id', async (req: Request, res: Response) => {
        const collection = await this.appDataSource.getRepository(Collection).findOneBy({
          id: req.params.id
        })

        if (collection) {
          const deleteDir = deleteDirectory(concatRoute(collection.rootPath, collection.name));
          if (deleteDir.status === 200) {
            const result = await this.appDataSource.getRepository(Collection).remove(collection)
            console.log(`Deleted collection: ${result.name}`)
            console.log(deleteDir.message)
            this.watcher.removeWatcher(concatRoute(collection.rootPath, collection.name))
            console.log(`Watcher removed for path: ${concatRoute(collection.rootPath, collection.name)}`)
            return res.status(200).send(`Collection ${result} deleted`)
          } else {
            return res.status(deleteDir.status).send(deleteDir.message)
          }
        }
        return res.status(404).send(`Collection ${req.params.id} not found`)
      })

      // Get all collections
      this.app.get('/api/v1/collection', async (req: Request, res: Response) => {
        const collections = await this.appDataSource.getRepository(Collection).find();
        if (collections) return res.json(collections)
        return res.status(404).send('Error in fetching saved collections')
      })

      // Get collection
      this.app.get('/api/v1/collection/:id', async (req: Request, res: Response) => {
        const collection = await this.appDataSource.getRepository(Collection).findOneBy({
          id: req.params.id
        })
        if (collection) return res.json(collection)
        return res.status(404).send(`Collection ${req.params.id} not found`)
      })

      // Create Auth key
      this.app.post('/api/v1/authkey', async (req: Request, res: Response) => {
        const body = req.body
        const newAuthKey = new AuthKey()
        Object.assign(newAuthKey, body)

        const result = await this.appDataSource.getRepository(AuthKey).save(newAuthKey);
        console.log(`Created Auth Credentials: ${result.name}`)

        return res.json(result);
      });

      // Get all Auth keys
      this.app.get('/api/v1/authkey', async (req: Request, res: Response) => {
        const authkeys = await this.appDataSource.getRepository(AuthKey).find();
        if (authkeys) return res.json(authkeys)
        return res.status(404).send('Error in fetching saved authkeys')
      })

      // Delete Auth key
      this.app.delete('/api/v1/authkey/:id', async (req: Request, res: Response) => {
        const authkey = await this.appDataSource.getRepository(AuthKey).findOneBy({
          id: req.params.id
        })

        if (authkey) {
          const result = await this.appDataSource.getRepository(AuthKey).remove(authkey)
          console.log(`Deleted Auth Credentials: ${result.name}`)
          return res.json(result)
        }
        return res.status(404).send(`AuthKey ${req.params.id} not found`)
      })

      // Create FlowTest AI
      this.app.post('/api/v1/flowtest/ai', async (req: Request, res: Response) => {
        const request = req.body
        const flowTestAI = new FlowtestAI();
        const nodes = await flowTestAI.generate(request.collection, request.cmd);

        return res.json(nodes);
      });

      // File Manager

      // Create directory
      this.app.post('/api/v1/file-manager/directory', (req: Request, res: Response) => {
        // Get the directory name that will be created, also get the path of the directory
        const { name, path } = req.body;

        const newDir = createDirectory(name, path)
        console.log(newDir.message)

        if (newDir.status === 201) {
          return res.status(newDir.status).send(concatRoute(path, name));
        } else {
          return res.status(newDir.status).send(newDir.message);
        }
      });

      // Delete directory
      this.app.delete('/api/v1/file-manager/directory', (req: Request, res: Response) => {
        // Get the directory name to be deleted
        const path = req.query.path.toString();

        const delDir = deleteDirectory(path)
        console.log(delDir.message)

        return res.status(delDir.status).send(delDir.message);
      });

      // Create file
      this.app.post('/api/v1/file-manager/file', (req: Request, res: Response) => {
        // Get the file name that will be created, also get the path of the directory 
        // and the content to write to that file
        const { name, path, content } = req.body;

        const newFile = createFile(name, path, content)
        console.log(newFile.message)

        if (newFile.status === 201) {
          return res.status(newFile.status).send(concatRoute(path, name));
        } else {
          return res.status(newFile.status).send(newFile.message);
        }
      });

      // Read file
      this.app.get('/api/v1/file-manager/file', (req: Request, res: Response) => {
        // Get the file path that will be read
        const { path } = req.body;

        const rFile = readFile(path)
        console.log(rFile.message)

        if (rFile.status === 201) {
          return res.status(rFile.status).send(rFile.content);
        } else {
          return res.status(rFile.status).send(rFile.message);
        }
      });

      // Update file
      this.app.put('/api/v1/file-manager/file', (req: Request, res: Response) => {
        // Get the file path that will be updated and the content to write to that file
        const { path, content } = req.body;

        const updateFile = upadateFile(path, content)
        console.log(updateFile.message)

        return res.status(updateFile.status).send(updateFile.message);
      });

      // Delete file
      this.app.delete('/api/v1/file-manager/file', (req: Request, res: Response) => {
        // Get the file path that will be deleted
        const path = req.query.path.toString();

        const delFile = deleteFile(path)
        console.log(delFile.message)

        return res.status(delFile.status).send(delFile.message);
      });

      // All other GET requests not handled before will return our React app
      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../../build', 'index.html'));
      });

      this.app.listen(this.port, () => {
        return console.log(`⚡️ [server]: FlowTest server is listening at http://localhost:${this.port}`);
      });
  }
}

let server = new App()
server.initServer()

