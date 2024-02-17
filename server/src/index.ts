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
import concatRoute from "./controllers/file-manager/util/concat-route";
import deleteFile from "./controllers/file-manager/delete-file";
import updateFile from "./controllers/file-manager/update-file";
import readFile from "./controllers/file-manager/read-file";
import { Watcher } from "./collections/watcher";
import { isDirectory } from "./controllers/file-manager/util/file-util";
import { InMemoryStateStore } from "./collections/statestore/store";
import { flowDataToReadableData, readableDataToFlowData } from "./flowtest/parser";

export class App {

  app: express.Application
  port: number
  appDataSource = AppDataSource
  collectionUtil: CollectionUtil
  timeout: number
  watcher: Watcher
  inMemoryStateStore: InMemoryStateStore

  constructor() {
    this.app = express()
    this.port = 3500
    this.collectionUtil = new CollectionUtil()
    this.timeout = 60000
    this.inMemoryStateStore = new InMemoryStateStore()
    this.watcher = new Watcher(this.inMemoryStateStore)
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

  private addCollectionToStore(collection: Collection, fullPath: string) {
    const collectionObj = {
      version: '1',
      id: collection.id,
      name: collection.name,
      pathname: fullPath,
      items: [],
      enviroments: []
    };
    // create collection tree first
    this.inMemoryStateStore.createCollection(collectionObj)
    this.watcher.addWatcher(fullPath, collection.id)
    console.log(`Watcher added for path: ${fullPath}`)
    return collectionObj;
  }

  private async addWatchersForExsistingCollections() {
      const collections = await this.appDataSource.getRepository(Collection).find();
      collections.forEach(async collection => {
        const fullPath = concatRoute(collection.rootPath, collection.name)
        // collection folder might have been deleted externally
        if (isDirectory(fullPath)) {
          this.addCollectionToStore(collection, fullPath)
        } else {
          const result = await this.appDataSource.getRepository(Collection).remove(collection)
          console.log(`Deleted collection: ${result.name}`)
        }
      })
  }

  init() {
      // to initialize the initial connection with the database, register all entities
      // and "synchronize" database schema, call "initialize()" method of a newly created database
      // once in your application bootstrap
      this.appDataSource.initialize()
        .then(() => {
            // here you can start to work with your database
            console.log('📦 [server]: Data Source has been initialized!')
            this.addWatchersForExsistingCollections();
        })
        .catch((error) => console.log('❌ [server]: Error during Data Source initialization:', error))

      this.app.use(cors())

      this.app.use(express.json({ limit: '50mb' }))
      this.app.use(express.raw({ limit: '50mb' }))
      this.app.use(express.text({ limit: '50mb' }))
      this.app.use(express.urlencoded({ limit: '50mb', extended: true }))

      // Have Node serve the files for our built React app
      this.app.use(express.static(path.resolve(__dirname, '../../../build')));

      /* --------------------------------------------------------------------------*/

      // Create FlowTest
      this.app.post('/api/v1/flowtest', async (req: Request, res: Response) => {
        const {name, path, flowData} = req.body

        try {
          const readableData = flowDataToReadableData(flowData);
          const file = createFile(`${name}.flow`, path, JSON.stringify(readableData, null, 4))
          if (file.status === 201) {
            return res.status(file.status).send(concatRoute(path, `${name}.flow`))
          } else {
            return res.status(file.status).send(file.message)
          }
        } catch(err) {
          console.log(`Failed to create flowtest: ${err}`);
          return res.status(500).send("Interal Server Error");
        }
      });

      // Update FlowTest
      this.app.put('/api/v1/flowtest', async (req: Request, res: Response) => {
        const {path, flowData} = req.body

        try {
          const readableData = flowDataToReadableData(flowData);
          const file = updateFile(path, JSON.stringify(readableData, null, 4))
          return res.status(file.status).send(file.message)
        } catch(err) {
          console.log(`Failed to update flowtest: ${err}`);
          return res.status(500).send("Interal Server Error");
        }
      })

      // Get FlowTest
      this.app.get('/api/v1/flowtest', async (req: Request, res: Response) => {
        const path = req.query.path.toString();

        const rFile = readFile(path)
        console.log(rFile.message)
        
        if (rFile.status === 200) {
          const flowData = readableDataToFlowData(JSON.parse(rFile.content));
          return res.status(rFile.status).json(flowData)
        } else {
          return res.status(rFile.status).send(rFile.message)
        }
      })

      // Delete FlowTest
      this.app.delete('/api/v1/flowtest', async (req: Request, res: Response) => {

        // Get the file path that will be deleted
        const path = req.query.path.toString();

        const delFile = deleteFile(path)
        console.log(delFile.message)

        return res.status(delFile.status).send(delFile.message);
      })

      /* --------------------------------------------------------------------------*/

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

      /* --------------------------------------------------------------------------*/

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
            // create env folder
            createDirectory("environments", concatRoute(newCollection.rootPath, newCollection.name))

            const collection = await this.appDataSource.getRepository(Collection).save(newCollection);
            console.log(`Created collection in db: ${collection.name}`)
            const collectionObj = this.addCollectionToStore(collection, concatRoute(collection.rootPath, collection.name))
            return res.status(201).json(collectionObj)
          } else {
            return res.status(dirResult.status).send(dirResult.message);
          }
        } catch(err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
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
            console.log(deleteDir.message)
            const result = await this.appDataSource.getRepository(Collection).remove(collection)
            console.log(`Deleted collection from db: ${result.name}`)
            // remove collection tree from in memory store
            this.inMemoryStateStore.removeCollection(req.params.id)
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
      this.app.get('/api/v1/collection', (req: Request, res: Response) => {
        return res.json(this.inMemoryStateStore.getAllCollection())
      })

      // Get collection
      this.app.get('/api/v1/collection/:id', (req: Request, res: Response) => {
        const collection = this.inMemoryStateStore.getCollection(req.params.id)
        if (collection) return res.json(collection)
        return res.status(404).send(`Collection ${req.params.id} not found`)
      })

      /* --------------------------------------------------------------------------*/
      // Create FlowTest AI
      this.app.post('/api/v1/flowtest/ai', async (req: Request, res: Response) => {
        const request = req.body
        const flowTestAI = new FlowtestAI();
        const nodes = await flowTestAI.generate(request.collection, request.cmd);

        return res.json(nodes);
      });

      /* --------------------------------------------------------------------------*/

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

        const updatedFile = updateFile(path, content)
        console.log(updatedFile.message)

        return res.status(updatedFile.status).send(updatedFile.message);
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
server.init()

// VisibleForTesting
export default server;

