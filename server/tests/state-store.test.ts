import { InMemoryStateStore } from "../src/collections/statestore/store"
import { Server } from 'socket.io'

jest.mock('socket.io', () => {
    return {
      Server: jest.fn().mockImplementation(() => {
        return {
          emit: () => {},
        };
      })
    };
});

describe("State store", () => {
    it("should correctly add and delete directory in the collection tree", () => {
        const store = new InMemoryStateStore(new Server())

        const collectionObj = {
            version: '1',
            id: "1",
            name: "collection",
            pathname: "/parent/collection",
            items: [],
            enviroments: []
        };

        // create collection
        store.createCollection(collectionObj)
        let collection = store.getAllCollection()[0]
        expect(collection).toEqual(collectionObj)

        // Create a new folder inside collection
        let directory = {
            name: "test-suite-1",
            pathname: "/parent/collection/test-suite-1"
        };
        store.addDirectory(directory, collectionObj.id)
        
        collection = store.getAllCollection()[0]
        expect(collection.items[0].name).toEqual(directory.name)
        expect(collection.items[0].pathname).toEqual(directory.pathname)

        directory = {
            name: "test-suite-3",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3"
        };
        store.addDirectory(directory, collectionObj.id)
        expect(collection.items[0].items[0].name).toEqual("test-suite-2")
        expect(collection.items[0].items[0].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2")

        expect(collection.items[0].items[0].items[0].name).toEqual(directory.name)
        expect(collection.items[0].items[0].items[0].pathname).toEqual(directory.pathname)

        directory = {
            name: "test-suite-2",
            pathname: "/parent/collection/test-suite-1/test-suite-2"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(collection.items[0].items).toEqual([])

        directory = {
            name: "collection",
            pathname: "/parent/collection"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(store.getAllCollection()).toEqual([])
    })

    it("should correctly add/delete/change file in the collection tree", () => {
        const store = new InMemoryStateStore(new Server())

        const collectionObj = {
            version: '1',
            id: "1",
            name: "collection",
            pathname: "/parent/collection",
            items: [],
            enviroments: []
        };

        // create collection
        store.createCollection(collectionObj)

        let directory = {
            name: "test-suite-3",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3"
        };
        store.addDirectory(directory, collectionObj.id)
        store.addFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)

        store.addFile({
            name: "test2.flow",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test2.flow"
        }, collectionObj.id)


        store.addFile({
            name: "test3.flow",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow"
        }, collectionObj.id)

        const collection = store.getCollection(collectionObj.id);
        const file1ModifiedTime = collection.items[0].items[1].modifiedAt
        expect(collection.items[0].items[1].name).toEqual("test1.flow")
        expect(collection.items[0].items[1].pathname).toEqual("/parent/collection/test-suite-1/test1.flow")

        expect(collection.items[0].items[0].items[1].name).toEqual("test2.flow")
        expect(collection.items[0].items[0].items[1].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2/test2.flow")

        expect(collection.items[0].items[0].items[0].items[0].name).toEqual("test3.flow")
        expect(collection.items[0].items[0].items[0].items[0].pathname).toEqual("/parent/collection/test-suite-1/test-suite-2/test-suite-3/test3.flow")

        store.changeFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)
        expect(collection.items[0].items[1].modifiedAt > file1ModifiedTime).toEqual(true)

        store.unlinkFile({
            name: "test1.flow",
            pathname: "/parent/collection/test-suite-1/test1.flow"
        }, collectionObj.id)
        expect(collection.items[0].items[1]).toEqual(undefined);

        directory = {
            name: "collection",
            pathname: "/parent/collection"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(store.getAllCollection()).toEqual([])
    })

    it("should add environment and dotEnv file correctly in collection tree", () => {
        const store = new InMemoryStateStore(new Server())

        const collectionObj = {
            version: '1',
            id: "1",
            name: "collection",
            pathname: "/parent/collection",
            items: [],
            enviroments: []
        };

        // create collection
        store.createCollection(collectionObj)

        let directory = {
            name: "test-suite-3",
            pathname: "/parent/collection/test-suite-1/test-suite-2/test-suite-3"
        };
        store.addDirectory(directory, collectionObj.id)

        const variables = {
            k1: "v1",
            k2: "v2"
        }
        store.addOrUpdateEnvFile({
            name: "staging.env",
            pathname: "/parent/collection/environments/staging.env",
            variables
        }, collectionObj.id)

        const dotEnvVars = {
            k: "v",
            v: "k"
        }
        store.addOrUpdateDotEnvVariables(collectionObj.id, dotEnvVars)

        const collection = store.getCollection(collectionObj.id);
        expect(collection.enviroments[0].variables).toEqual(variables)
        expect(collection.dotEnvVariables).toEqual(dotEnvVars)

        store.addOrUpdateEnvFile({
            name: "staging.env",
            pathname: "/parent/collection/environments/staging.env",
            variables: {
                ...variables,
                k3: "v3"
            }
        }, collectionObj.id)
        store.addOrUpdateDotEnvVariables(collectionObj.id, {
            ...dotEnvVars,
            t: "k"
        })
        expect(collection.enviroments[0].variables).toEqual({
            ...variables,
            k3: "v3"
        })
        expect(collection.dotEnvVariables).toEqual({
            ...dotEnvVars,
            t: "k"
        })

        store.unlinkEnvFile({
            name: "staging.env",
            pathname: "/parent/collection/environments/staging.env",
        }, collectionObj.id)
        expect(collection.enviroments).toEqual([])

        // try to remove a env file should not error out
        store.unlinkEnvFile({
            name: "staging.env",
            pathname: "/parent/collection/environments/staging.env",
        }, collectionObj.id)
        expect(collection.enviroments).toEqual([])

        directory = {
            name: "collection",
            pathname: "/parent/collection"
        };
        store.unlinkDirectory(directory, collectionObj.id)
        expect(store.getAllCollection()).toEqual([])
    })
})