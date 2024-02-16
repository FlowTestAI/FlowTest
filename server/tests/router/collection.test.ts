import server from "../../src"
import request from "supertest"
import { isDirectory } from "../../src/controllers/file-manager/util/file-util";

describe("Collection", () => {
    it("perform crud operations via respective endpoints", async () => {
        // wait for server init
        await new Promise((r) => setTimeout(r, 2000));

        let res = await request(server.app)
            .post('/api/v1/collection')
            .field("rootPath", __dirname)
            .attach("file", 'tests/test.yaml')

        const collection = res.body
        expect(server.inMemoryStateStore.getAllCollection()[0]).toEqual(collection)
        await new Promise((r) => setTimeout(r, 200));
        expect(server.watcher.hasWatcher(collection.pathname)).toEqual(true)
        expect(isDirectory(collection.pathname)).toEqual(true)
        expect(isDirectory(collection.pathname.concat("/environments"))).toEqual(true)

        res = await request(server.app)
            .post('/api/v1/collection')
            .field("rootPath", __dirname)
            .attach("file", 'tests/test.yaml')

        // Directory already exists
        expect(res.status).toEqual(400)

        res = await request(server.app).get(`/api/v1/collection/${collection.id}`)
        expect(res.body).toEqual(collection)

        res = await request(server.app).get('/api/v1/collection')
        expect(res.body[0]).toEqual(collection)

        res = await request(server.app).delete(`/api/v1/collection/${collection.id}`)
        expect(server.inMemoryStateStore.getAllCollection()).toEqual([])
        expect(server.watcher.hasWatcher(collection.pathname)).toEqual(false)
        expect(isDirectory(collection.pathname)).toEqual(false)
        expect(isDirectory(collection.pathname.concat("/environments"))).toEqual(false)
        
    }, 20000)
})