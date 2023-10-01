import "reflect-metadata"
import express from 'express';
import cors from 'cors'
import { AppDataSource } from "./data-source";

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
      
      this.app.get('/', (req, res) => {
        res.send('Hello World!');
      });
      
      this.app.listen(this.port, () => {
        return console.log(`⚡️ [server]: FlowTest server is listening at http://localhost:${this.port}`);
      });
  }
}

let server = new App()
server.initServer()

