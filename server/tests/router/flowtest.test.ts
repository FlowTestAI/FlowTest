import server from "../../src"
import request from "supertest"
import { isDirectory, pathExists } from "../../src/controllers/file-manager/util/file-util";

describe("FlowTest", () => {
    it("perform crud operations via respective endpoints", async () => {
        // wait for server init
        await new Promise((r) => setTimeout(r, 2000));

        let res = await request(server.app)
            .post('/api/v1/collection')
            .field("rootPath", __dirname)
            .attach("file", 'tests/test.yaml')

        const collection = res.body
        const dir = await request(server.app).post('/api/v1/file-manager/directory')
            .send({ name: "test-suite-1", path: collection.pathname })

        let flowData = {"nodes":[{"width":150,"height":54,"id":"0","type":"startNode","position":{"x":150,"y":150},"deletable":false,"positionAbsolute":{"x":150,"y":150}},{"width":322,"height":415,"id":"1","type":"requestNode","position":{"x":650,"y":50},"data":{"url":"https://petstore3.swagger.io/api/v3/pet","description":"Add a new pet to the store","operationId":"addPet","requestType":"POST","requestBody":{"type":"raw-json","body":"{\"id\":1,\"name\":\"Max\",\"category\":{\"id\":1,\"name\":\"Dog\"},\"photoUrls\":[\"https://example.com/max.jpg\"],\"tags\":[{\"id\":1,\"name\":\"friendly\"}],\"status\":\"available\"}"},"type":"requestNode","variables":{}},"positionAbsolute":{"x":650,"y":50}},{"width":322,"height":323,"id":"2","type":"requestNode","position":{"x":1150,"y":50},"data":{"url":"https://petstore3.swagger.io/api/v3/pet/findByStatus?status={status}","description":"Finds Pets by status","operationId":"findPetsByStatus","requestType":"GET","variables":{"status":{"type":"string","value":"available"}},"type":"requestNode"},"positionAbsolute":{"x":1150,"y":50}},{"width":322,"height":386,"id":"3","type":"requestNode","position":{"x":1650,"y":50},"data":{"url":"https://petstore3.swagger.io/api/v3/pet/{petId}","description":"Deletes a pet","operationId":"deletePet","requestType":"DELETE","variables":{"api_key":{"type":"string","value":"abc123"},"petId":{"type":"number","value":1}},"type":"requestNode"},"positionAbsolute":{"x":1650,"y":50}}],"edges":[{"id":"reactflow__edge-0-1","source":"0","sourceHandle":null,"target":"1","targetHandle":null,"type":"buttonedge","animated":false},{"id":"reactflow__edge-1-2","source":"1","sourceHandle":null,"target":"2","targetHandle":null,"type":"buttonedge","animated":false},{"id":"reactflow__edge-2-3","source":"2","sourceHandle":null,"target":"3","targetHandle":null,"type":"buttonedge","animated":false}],"viewport":{"x":-36.764744037521154,"y":283.77128031134623,"zoom":0.6241892026743837}}

        res = await request(server.app).post('/api/v1/flowtest')
            .send({ name: "test", path: dir.text, flowData })
        const flowTestPath = res.text

        res = await request(server.app).get(`/api/v1/flowtest?path=${flowTestPath}`)
        expect(res.body.nodes).toEqual(flowData.nodes);
        expect(res.body.edges).toEqual(flowData.edges);

        // update flowtest
        flowData = {"nodes":[{"width":150,"height":54,"id":"0","type":"startNode","position":{"x":150,"y":150},"deletable":false,"positionAbsolute":{"x":150,"y":150}},{"width":322,"height":415,"id":"1","type":"requestNode","position":{"x":650,"y":50},"data":{"url":"https://petstore3.swagger.io/api/v3/pet","description":"Add a new pet to the store","operationId":"addPet","requestType":"POST","requestBody":{"type":"raw-json","body":"{\"id\":1,\"name\":\"Max\",\"category\":{\"id\":1,\"name\":\"Dog\"},\"photoUrls\":[\"https://example.com/max.jpg\"],\"tags\":[{\"id\":1,\"name\":\"friendly\"}],\"status\":\"available\"}"},"type":"requestNode","variables":{}},"positionAbsolute":{"x":650,"y":50}},{"width":322,"height":323,"id":"2","type":"requestNode","position":{"x":1150,"y":50},"data":{"url":"https://petstore3.swagger.io/api/v3/pet/findByStatus?status={status}","description":"Finds Pets by status","operationId":"findPetsByStatus","requestType":"GET","variables":{"status":{"type":"string","value":"available"}},"type":"requestNode"},"positionAbsolute":{"x":1150,"y":50}}],"edges":[{"id":"reactflow__edge-0-1","source":"0","sourceHandle":null,"target":"1","targetHandle":null,"type":"buttonedge","animated":false},{"id":"reactflow__edge-1-2","source":"1","sourceHandle":null,"target":"2","targetHandle":null,"type":"buttonedge","animated":false}],"viewport":{"x":-36.764744037521154,"y":283.77128031134623,"zoom":0.6241892026743837}}
        res = await request(server.app).put('/api/v1/flowtest')
            .send({ path: flowTestPath, flowData })
        
        res = await request(server.app).get(`/api/v1/flowtest?path=${flowTestPath}`)
        expect(res.body.nodes).toEqual(flowData.nodes);
        expect(res.body.edges).toEqual(flowData.edges);

        res = await request(server.app).delete(`/api/v1/collection/${collection.id}`)
        expect(isDirectory(collection.pathname)).toEqual(false)
        expect(isDirectory(collection.pathname.concat("/environments"))).toEqual(false)
        expect(isDirectory(collection.pathname.concat("/test-suite-1"))).toEqual(false)
        expect(pathExists(flowTestPath)).toEqual(false)
        
    }, 60000)
})